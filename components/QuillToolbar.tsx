// QuillToolbar.js
import React from 'react';

const QuillToolbar = () => (
    <div id="toolbar" className="flex space-x-4 bg-gray-200 p-2 rounded-lg shadow-lg">
    <select className="ql-font w-24 p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:border-blue-500">
      <option value="arial" selected>Arial</option>
      <option value="comic-sans">Comic Sans</option>
      <option value="courier-new">Courier New</option>
    </select>
    <select className="ql-size w-24 p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:border-blue-500">
      <option value="small">Small</option>
      <option value="medium" selected>Normal</option>
      <option value="large">Large</option>
    </select>
    <select className="ql-color w-24 p-2 rounded-md border border-gray-300 bg-white shadow-sm focus:outline-none focus:border-blue-500">
      <option value="red">Red</option>
      <option value="green">Green</option>
      <option value="blue">Blue</option>
    </select>
  </div>
);

export default QuillToolbar;
