
export const colorClasses = ['red', 'orange', 'green', 'blue', 'gray'];

export const getColorClass = el => el.className.split(' ')
  .filter(cl => { return colorClasses.includes(cl); })[0];

/*
  Ref: https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
      https://www.w3schools.com/css/css_image_transparency.asp
*/
export const colorMap =  {'rgba(0, 255, 127, 0.8)': 'green', 'rgba(255, 140, 0, 0.8)': 'orange',
        'rgba(205, 92, 92, 0.8)': 'red', 'rgba(0, 0, 255, 0.8)': 'blue', 'rgba(119, 136, 153, 0.8)': 'grey'};

export const getColor_rgba = (el) => {
  const rgb = window.getComputedStyle(el, null)['background-color']
  const alpha = window.getComputedStyle(el, null)['opacity']
  const rgba = `rgba(${ rgb.substring(4).substr(0, rgb.length-5)}, ${alpha})`
  return colorMap[rgba];
}
