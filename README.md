# Tree Visualizer

Tree Visualizer is a web application that allows users to visualize different types of trees (Binary Tree, Max-Heap, Binary Search Tree) based on an input array. Users can input an array of integers, choose the type of tree they want to visualize, and see the corresponding tree structure. Additionally, clicking on a tree node highlights the corresponding element in the array.

## Project Structure

The project consists of the following files and directories:

```
.
├── index.html
├── style.css
└── js
    ├── app.js
    ├── heap.js
    └── nodes.js
```

- `index.html`: The main HTML file that contains the structure of the web application.
- `style.css`: The CSS file that styles the web application.
- `js/app.js`: JavaScript file that handles the main logic for tree visualization and user interaction.
- `js/heap.js`: JavaScript file that contains the logic for Max-Heap visualization.
- `js/nodes.js`: JavaScript file that contains the logic for creating and managing tree nodes.

## Installation

To run the Tree Visualizer locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/vijay5375/Tree-Visualizer.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Tree-Visualizer
    ```
3. Open `index.html` in your web browser:
    ```bash
    open index.html
    ```

## Usage

1. **Input Array**: Enter a comma-separated list of integers in the input field labeled "Array".
2. **Select Visualization**:
    - Click on the "Binary Tree Visualization" button to see a binary tree representation.
    - Click on the "Max-Heap Visualization" button to see a Max-Heap representation.
    - Click on the "Binary Search Tree Visualization" button to see a binary search tree representation.
3. **Interaction**:
    - Click on any node in the tree to highlight the corresponding element in the array and vice versa.


## Dependencies

- [D3.js](https://d3js.org/) (included via CDN in `index.html`)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue to improve the project.

## License

This project is licensed under the MIT License.
