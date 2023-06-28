to implement html tags in the string for the "review section"
----------------------------------------------
const myString = "<b>Hello, World!</b>";
const escapedHTML = { __html: myString };

<div dangerouslySetInnerHTML={escapedHTML}/>


