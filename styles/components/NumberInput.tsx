import { Platform } from "react-native";
import { Input, Icon, Button, InputProps } from "react-native-magnus";

interface NumberInputProps extends Omit<InputProps, 'value'> {
  min?:number;
  max?:number;
  pre?:string;
  step?:number;
  value: number;
  setValue: (number) => void;
}

export default function NumberInput({
  min = 0,
  max = Infinity,
  step = 1,
  pre = '',
  value,
  setValue,
  ...props
}: NumberInputProps) {
  function updateValue(newVal) {
    if (typeof newVal !== "number") {
      try {
        newVal = parseInt(newVal);
      } catch {
        // Not a number string
        return;
      }
    }
    if (!newVal) newVal = 0;
    setValue(Math.min(max, Math.max(newVal, min)));
  }

  return (
    <Input
      w={Platform.OS === 'web' ? null : 150}
      {...props}
      value={pre + value.toString()}
      textAlign={"center"}
      onChangeText={updateValue}
      focusBorderColor="blue700"
      pt={0}
      pb={0}
      pl={0}
      pr={0}
      suffix={
        <Button
          disabled={value >= max}
          onPress={() => updateValue(value + step)}
          roundedLeft={0}
          bg="blue500"
        >
          <Icon name="plus" color={"white"} />
        </Button>
      }
      prefix={
        <Button
          disabled={value <= min}
          onPress={() => updateValue(value - step)}
          roundedRight={0}
          bg="blue500"
        >
          <Icon name="minus" color={"white"} />
        </Button>
      }
    />
  );
}
