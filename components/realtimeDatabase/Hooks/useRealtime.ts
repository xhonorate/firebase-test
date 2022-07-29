/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useEffect, useCallback, useState } from 'react'
import { empty } from '@nandorojo/swr-firestore/src/helpers/empty'
import { fuego } from '@nandorojo/swr-firestore';

function withReferenceDatesParsed<Data extends object>(
  data: Data,
  parseDates?: (keyof Data | string)[]
) {
  const ref = { ...data }
  parseDates?.forEach(dateField => {
    if (typeof dateField !== 'string') return

    //@ts-ignore
    const unparsedDate = ref[dateField]
    if (unparsedDate) {
      const parsedDate: Date | undefined = unparsedDate.toDate?.()
      if (parsedDate) {
        //@ts-ignore
        ref[dateField] = parsedDate;
      }
    }
  })

  return ref
}

type Options<Ref extends object> = {
  /**
   * If `true`, sets up a real-time subscription to the Firestore backend.
   *
   * Default: `false`
   */
  listen?: boolean
  /**
   * An array of key strings that indicate where there will be dates in the Document.
   *
   * Example: if your dates are in the `lastUpdated` and `user.createdAt` fields, then pass `{parseDates: ["lastUpdated", "user.createdAt"]}`.
   *
   * This will automatically turn all Firestore dates into JS Date objects, removing the need to do `.toDate()` on your dates.
   */
  parseDates?: (
    | string
    | keyof Omit<Ref, 'id' | 'exists'>
  )[]
}

// Fetch the value ONCE without attatching a listener
export const getSnapshot = async <Ref extends object>(
  path: string,
  {
    parseDates,
  }: {
    parseDates?: (
      | string
      | keyof Omit<Ref, 'id' | 'exists'>
    )[]
  } = empty.object
) => {
  //@ts-ignore
  const data = await fuego?.rtdb
    .ref(path)
    .get()
    .then(ref => {
      const RefData = ref.val() ?? empty.object
      return withReferenceDatesParsed(
        ({
          ...RefData,
          id: ref.exists,
          exists: ref.exists,
        } as unknown) as Ref,
        parseDates
      )
    })

  return data
}

export const useRealtime = <
  Data extends object = {}
>(
  path: string | null,
  onChange?: (data: Data) => void | null
) => {
  const [data, setData] = useState<Data>(null);
  const [loading, setLoading] = useState(true);
  const unsubscribeRef = useRef(null);
  const onChangeRef = useRef(onChange);

  //@ts-ignore
  const ref = fuego?.rtdb.ref(path);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange])

  // Attatch listener for updates to data
  useEffect(() => {
    if (!data) return;
    onChangeRef.current?.(data);
  }, [data])

  // we move listen to a Ref
  // why? because we shouldn't have to include "listen" in the key
  // if we do, then calling mutate() won't be consistent for all
  // Documents with the same path.
  useEffect(() => {
    unsubscribeRef.current = () => ref.off()
    ref.on('value', res => {
      if (loading) setLoading(false);
      setData(res.val());
    });

    return () => {
      // clean up listener on unmount if it exists
      if (unsubscribeRef.current) {
        console.log("unsub")
        unsubscribeRef.current()
        unsubscribeRef.current = null
      }
    }
  }, [path])

  /**
   * `set(data, SetOptions?)`: Extends the `firestore` Document `set` function.
   * - You can call this when you want to edit your Document.
   * - It also updates the local cache using SWR's `mutate`. This will prove highly convenient over the regular Firestore `set` function.
   * - The second argument is the same as the second argument for [Firestore `set`](https://firebase.google.com/Refs/firestore/manage-data/add-data#set_a_Document).
   */
  const set = useCallback(
    (data: Data) => {
      if (!path) return null
      return ref.set(data)
    },
    [path]
  )

  /**
   * - `update(data)`: Extends the Firestore Document [`update` function](https://firebase.google.com/Refs/firestore/manage-data/add-data#update-data).
   * - It also updates the local cache using SWR's `mutate`. This will prove highly convenient over the regular `set` function.
   */
  const update = useCallback(
    (data: Data) => {
      if (!path) return null
      return ref.update(data)
    },
    [path]
  )

  const deleteReference = useCallback(
    () => {
      if (!path) return null
      return ref.remove()
    },
    [path]
  )

  return {
    data,
    set,
    update,
    loading: loading,
    deleteReference,
    /**
     * A function that, when called, unsubscribes the Firestore listener.
     *
     * The function can be null, so make sure to check that it exists before calling it.
     *
     * **Note**: This is not necessary to use. `useDocument` already unmounts the listener for you. This is only intended if you want to unsubscribe on your own.
     */
    unsubscribe: unsubscribeRef.current
  }
}

// const useSubscription = (path: string) => {
//   const unsubscribeRef = useRef<
//     ReturnType<typeof createListener>['unsubscribe'] | null
//   >(null)

//   const swr = useSWR([path], path => {
//     const { unsubscribe, latestData } = createListener(path)
//     unsubscribeRef.current = unsubscribe
//     return latestData()
//   })

//   useEffect(() => {
//     return () => {
//       if (unsubscribeRef.current) {
//         unsubscribeRef.current()
//       }
//     }
//   }, [path])
//   return swr
// }
