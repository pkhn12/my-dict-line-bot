export default {
  type: "flex",
  altText: 'confirmation',
  contents: {
    type: 'bubble',
    size: 'micro',
    action: {
      type: 'postback',
      data: keyword,
    },
    body: {
      type: 'box',
      layout: 'baseline',
      contents: [
        {
          type: 'filler',
        },
        {
          type: 'text',
          text: '+ เพิ่มความหมาย',
          color: '#ffffff',
          flex: 0,
        },
        {
          type: 'filler',
        },
      ],
      spacing: 'sm',
      backgroundColor: '#17C950',
      margin: 'none',
      paddingStart: 'none',
      paddingEnd: 'none',
    },
  }
}
