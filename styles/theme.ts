// this is our custom theme
const theme: any = {
  colors: {
    violet100: "#e1e1e1",
  },
  fontSize: {
    bigText100: 32,
  },
  spacing: {
    'none': 0,
    xs: 2,
    '5xl': 64
  },
  // components defaults can also be customized
  components: {
    Text: {
      color: 'gray800',
      variants: {
        heading: {
          fontSize: 'xl'
        } 
      }
    }
  }
};


//TODO: export seperate light/dark themes, useState to switch between them in App.tsx


export default theme;