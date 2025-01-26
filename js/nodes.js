const regFill = "green";
const highlightFill = "lightblue";
const regFillText = "black";
const highlightFillText = "white";

let treeContainer;
let arrayContainer;
let start;

const xSpacing = 200;
const ySpacing = 120;
const radius = 35;

function Node(value, index, depth, cx, cy) {
    this.value = value;
    this.index = index;
    this.depth = depth;
    this.cx = cx;
    this.cy = cy;
    this.left = null;
    this.right = null;
    this.fill = regFill;
    this.highlighted = false;
}

function Tree() {
    this.nodes = [];
    this.data = [];
    this.text = [];
    this.levelOrderArray = []; // To store level order traversal of displayed tree

    this.addNode = function(node) {
        if (node.value !== 'N') {
            this.data.push(node);
            this.levelOrderArray.push(node.value);
            
            this.text = treeContainer.selectAll("text.circle")
                .data(this.data)
                .enter()
                .append("text")
                .attr("class", "circle")
                .attr("x", d => d.cx - (d.value.toString().length*4))
                .attr("y", 0)
                .text(d => d.value)
                .transition()
                .duration(100)
                .attr("y", d => d.cy + 5)
                .call(textAttr, regFillText, "sans-serif", "1em");

            this.nodes = treeContainer.selectAll("circle")
                .data(this.data)
                .enter()
                .append("circle");
        }
    }

    this.createBinaryTree = function(arr) {
        treeContainer = createContainer("binary-tree", arr);
        start = treeContainer.attr("width") / 2;
        this.levelOrderArray = []; // Reset level order array
        
        // Create queue to store nodes at each level
        let queue = [];
        let nodeMap = new Map();
        
        // Create root node
        if (arr[0] !== 'N') {
            let root = new Node(arr[0], 0, 0);
            root.cx = start;
            root.cy = radius;
            nodeMap.set(0, root);
            queue.push({node: root, index: 0});
            this.addNode(root);
        }
        
        // Process each level
        let currentIndex = 1;
        while (queue.length > 0) {
            let levelSize = queue.length;
            let currentDepth = queue[0].node.depth + 1;
            
            for (let i = 0; i < levelSize; i++) {
                let current = queue.shift();
                let parentNode = current.node;
                let parentIndex = current.index;
                
                // Process left child
                if (currentIndex < arr.length) {
                    if (arr[currentIndex] !== 'N') {
                        let leftNode = new Node(arr[currentIndex], currentIndex, currentDepth);
                        leftNode.cx = parentNode.cx - xSpacing / Math.pow(1.2, currentDepth);
                        leftNode.cy = parentNode.cy + ySpacing;
                        
                        nodeMap.set(currentIndex, leftNode);
                        queue.push({node: leftNode, index: currentIndex});
                        
                        // Draw connection line
                        treeContainer.append("line")
                            .call(createLineAttr, "black", parentNode.cx, parentNode.cy, leftNode.cx, leftNode.cy);
                        
                        this.addNode(leftNode);
                    }
                    currentIndex++;
                }
                
                // Process right child
                if (currentIndex < arr.length) {
                    if (arr[currentIndex] !== 'N') {
                        let rightNode = new Node(arr[currentIndex], currentIndex, currentDepth);
                        rightNode.cx = parentNode.cx + xSpacing / Math.pow(1.2, currentDepth);
                        rightNode.cy = parentNode.cy + ySpacing;
                        
                        nodeMap.set(currentIndex, rightNode);
                        queue.push({node: rightNode, index: currentIndex});
                        
                        // Draw connection line
                        treeContainer.append("line")
                            .call(createLineAttr, "black", parentNode.cx, parentNode.cy, rightNode.cx, rightNode.cy);
                        
                        this.addNode(rightNode);
                    }
                    currentIndex++;
                }
            }
        }
        
        this.nodes = treeContainer
            .selectAll("circle")
            .raise()
            .on("click", addHighlight);
            
        this.text = treeContainer
            .selectAll("text.circle")
            .raise()
            .on("click", addHighlight);
            
        this.nodes.call(circleAttr);
    }
}

// Utility functions remain the same
function leftChild(i) { return 2 * i + 1; }
function rightChild(i) { return 2 * i + 2; }
function parent(i) { return Math.floor((i - 1) / 2); }

function circleAttr(selection) {
    selection
        .attr("cx", function(c) { return c.cx; })
        .attr("cy", 0)
        .attr("r", function(c) { return radius; })
        .attr("fill", function(c) { return c.fill; })
        .transition()
        .duration(100)
        .attr("cy", function(c) { return c.cy; });
}

function textAttr(selection, fill, fontFamily, fontSize) {
    selection
        .attr("fill", fill)
        .attr("font-family", fontFamily)
        .attr("font-size", fontSize);
}

function createLineAttr(selection, stroke, x1, y1, x2, y2) {
    selection
        .style("stroke", stroke)
        .attr("x1", x1)
        .attr("y1", 0)
        .attr("x2", x2)
        .attr("y2", 0)
        .transition()
        .duration(100)
        .attr("y1", y1)
        .attr("y2", y2);
}

function addHighlight(data, index) {
    removeHighlight();
    
    d3.selectAll("circle").select(function(d, i) { 
        return i === index ? this : null; 
    }).attr("fill", highlightFill);
    
    d3.selectAll("rect").select(function(d, i) { 
        return i === index ? this : null; 
    }).attr("fill", highlightFill);
    
    d3.selectAll("text.circle").select(function(d, i) { 
        return i === index ? this : null; 
    }).attr("fill", highlightFillText);
    
    d3.selectAll("text.rect").select(function(d, i) { 
        return i === index ? this : null; 
    }).attr("fill", highlightFillText);
}

function removeHighlight() {
    d3.selectAll("circle").attr("fill", regFill);
    d3.selectAll("rect").attr("fill", regFill);
    d3.selectAll("text.circle").attr("fill", regFillText);
    d3.selectAll("text.rect").attr("fill", regFillText);
}

function calcDimensions(arr) {
    // Calculate the maximum possible depth of the tree
    let depth = Math.ceil(Math.log2((arr.length - 1) + 2)) - 1;
    
    // Increase width based on depth to accommodate all nodes
    let width = Math.max(1000, Math.pow(2, depth) * 100);
    
    // Increase height calculation to ensure enough vertical space
    // Add extra padding (200) to accommodate the deepest nodes
    let height = (ySpacing * (depth + 1)) + 200;
    
    return { width, height, depth };
}

function createContainer(id, arr) {
    let container = d3.select(`div#${id}`);
    let box = calcDimensions(arr);
    
    container = d3.select(`div#${id}`)
        .append('svg')
        .attr('width', box.width)
        .attr('height', box.height);
        
    return container;
}

function createArray(arr, x, y, width, height) {
    // Only use non-'N' values in the order they appear in the tree
    let displayArr = arr.filter(val => val !== 'N');
    
    var arrayData = displayArr.map((value, i) => {
        if (i > 0) {
            x += 50;
        }
        return {
            x: x,
            y: y,
            width: width,
            height: height,
            color: regFill,
            value: value
        };
    });

    var elementsArr = arrayContainer.selectAll("rect")
        .data(arrayData)
        .enter()
        .append("rect")
        .on("click", addHighlight);

    d3.select("#array-visual").attr("align", "center");

    elementsArr.attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("width", d => d.width)
        .attr("height", d => d.height)
        .attr("fill", regFill)
        .attr("value", d => d.value);

    arrayContainer.selectAll("text.rect")
        .data(arrayData)
        .enter()
        .append("text")
        .attr("class", "rect")
        .on("click", addHighlight)
        .attr("x", d => d.x + (d.width / 2) - (d.value.toString().length*4))
        .attr("y", d => d.y + 30)
        .text(d => d.value)
        .call(textAttr, regFillText, "sans-serif", "1em");
    
    arrayContainer.selectAll("text.index")
        .data(arrayData)
        .enter()
        .append("text")
        .attr("class", "index")
        .text((d, i) => `[${i}]`)
        .attr("x", d => d.x + 15)
        .attr("y", d => d.y - 15)
        .call(textAttr, regFillText, "sans-serif", "15px");

    return arrayData;
}

function createBinaryTreeAndArray(arr) {
    arrayContainer = createContainer("array-visual", arr.filter(v => v !== 'N'));
    let tree = new Tree();
    tree.createBinaryTree(arr);
    createArray(arr, 2, 30, 50, 50);
}

// Export functions needed by other files
window.createBinaryTreeAndArray = createBinaryTreeAndArray;
window.createArray = createArray;
window.Tree = Tree;
window.removeHighlight = removeHighlight;