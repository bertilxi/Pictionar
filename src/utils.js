export const hasClass = (ele, cls) => {
  return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
};
export const addClass = (ele, cls) => {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
};
export const removeClass = (ele, cls) => {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
};
