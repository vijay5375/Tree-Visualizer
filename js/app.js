let currentVisualizationType = null;
let input = null;

// Input format instructions for each visualization type
const inputInstructions = {
    binary: "Enter values in level order traversal format. Use 'N' for empty nodes. Example: 1,2,3,N,N,4,6,N,5",
    'max-heap': "Enter comma-separated integers. Example: 10,20,60,30,70,40,50",
    'min-heap': "Enter comma-separated integers. Example: 10,20,60,30,70,40,50",
    bst: {
        levelOrder: "Enter values in level order traversal format. Use 'N' for empty nodes. Example: 1,2,3,N,N,4,6",
        sequential: "Enter comma-separated integers. Example: 10,20,60,30,70,40,50"
    },
    avl: "Enter values in level order traversal format. Use 'N' for empty nodes. Example: 1,2,3,N,N,4,6"
};

// Setup event listeners
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    // Set default view
    showSelectionScreen();
});

function setupEventListeners() {
    // Visualization type selection
    document.querySelectorAll('.viz-option').forEach(button => {
        button.addEventListener('click', function() {
            currentVisualizationType = this.dataset.type;
            showInputScreen();
        });
    });

    // BST input method selection
    document.getElementById('level-order-btn').addEventListener('click', () => {
        updateBSTInputMethod('levelOrder');
    });

    document.getElementById('sequential-btn').addEventListener('click', () => {
        updateBSTInputMethod('sequential');
    });

    // Navigation buttons
    document.getElementById('back-btn').addEventListener('click', showSelectionScreen);
    document.getElementById('visualize-btn').addEventListener('click', createVisualization);
    document.getElementById('new-input-btn').addEventListener('click', showInputScreen);

    // Click outside to remove highlight
    document.addEventListener('click', function(event) {
        if (!event.target.closest('circle') && 
            !event.target.closest('rect') && 
            !event.target.closest('text')) {
            removeHighlight();
        }
    });
}

function displayError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;

    const inputContainer = document.querySelector('.input-container');
    const existingError = inputContainer.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    inputContainer.insertBefore(errorDiv, document.getElementById('visualize-btn'));
}

function clearError() {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function showSelectionScreen() {
    document.getElementById('selection-screen').classList.remove('hidden');
    document.getElementById('input-screen').classList.add('hidden');
    document.getElementById('visualization-screen').classList.add('hidden');
}

function showInputScreen() {
    document.getElementById('selection-screen').classList.add('hidden');
    document.getElementById('input-screen').classList.remove('hidden');
    document.getElementById('visualization-screen').classList.add('hidden');

    // Set input instructions
    const instructionsElem = document.getElementById('input-instructions');
    const inputMethodSelector = document.getElementById('input-method-selector');
    const inputField = document.getElementById('array-input');
    
    if (currentVisualizationType === 'bst') {
        inputMethodSelector.classList.remove('hidden');
        instructionsElem.textContent = inputInstructions.bst.sequential;
        inputField.placeholder = inputInstructions.bst.sequential;
    } else {
        inputMethodSelector.classList.add('hidden');
        instructionsElem.textContent = inputInstructions[currentVisualizationType];
        inputField.placeholder = inputInstructions[currentVisualizationType];
    }

    // Clear previous input and errors
    inputField.value = '';
    clearError();
}

function updateBSTInputMethod(method) {
    const levelOrderBtn = document.getElementById('level-order-btn');
    const sequentialBtn = document.getElementById('sequential-btn');
    const inputField = document.getElementById('array-input');
    const instructionsElem = document.getElementById('input-instructions');
    
    if (method === 'levelOrder') {
        levelOrderBtn.classList.add('active');
        sequentialBtn.classList.remove('active');
        instructionsElem.textContent = inputInstructions.bst.levelOrder;
        inputField.placeholder = inputInstructions.bst.levelOrder;
    } else {
        levelOrderBtn.classList.remove('active');
        sequentialBtn.classList.add('active');
        instructionsElem.textContent = inputInstructions.bst.sequential;
        inputField.placeholder = inputInstructions.bst.sequential;
    }
    
    inputField.value = '';
    clearError();
}

function reset() {
    d3.selectAll('svg').remove();
}

function parseInput(inputText) {
    clearError();
    try {
        switch (currentVisualizationType) {
            case 'binary':
                return Validator.validateLevelOrder(inputText);
            
            case 'max-heap':
            case 'min-heap':
                return Validator.validateHeapInput(inputText);
            
            case 'bst':
                const inputMethod = document.querySelector('#level-order-btn.active') 
                    ? 'levelOrder' 
                    : 'sequential';
                return inputMethod === 'levelOrder' 
                    ? Validator.validateBSTLevelOrder(inputText)
                    : Validator.validateBSTSequential(inputText);
            
            case 'avl':
                return Validator.validateAVLInput(inputText);
            
            default:
                throw new Error('Invalid visualization type');
        }
    } catch (error) {
        displayError(error.message);
        throw error;
    }
}

function createVisualization() {
    let inputText = document.getElementById('array-input').value.trim();
    
    try {
        input = parseInput(inputText);
    } catch (error) {
        return; // Error is already displayed
    }

    try {
        // Show visualization screen
        document.getElementById('input-screen').classList.add('hidden');
        document.getElementById('visualization-screen').classList.remove('hidden');

        // Clear previous visualization
        reset();

        // Create visualization based on type
        switch (currentVisualizationType) {
            case 'binary':
                createBinaryTreeVisualization(input);
                break;
            case 'max-heap':
                createHeapVisualization(input, 'max');
                break;
            case 'min-heap':
                createHeapVisualization(input, 'min');
                break;
            case 'bst':
                const inputMethod = document.querySelector('#level-order-btn.active') 
                    ? 'levelOrder' 
                    : 'sequential';
                createBSTVisualization(input, inputMethod);
                break;
            case 'avl':
                createAVLVisualization(input);
                break;
        }
    } catch (error) {
        displayError('Error creating visualization: ' + error.message);
        showInputScreen();
    }
}

function createBinaryTreeVisualization(arr) {
    document.getElementById('visual-title').textContent = "Binary Tree Visualization";
    document.getElementById('instructions').textContent = 
        "Click a value in the tree or array to highlight its corresponding location. Click again or empty space to remove highlight.";
    createBinaryTreeAndArray(arr);  // This function is now available globally
}

function createHeapVisualization(arr, type) {
    const heapArr = makeHeap(arr, type);
    document.getElementById('visual-title').textContent = 
        type === 'max' ? "Max-Heap Visualization" : "Min-Heap Visualization";
    document.getElementById('instructions').textContent = 
        type === 'max' ? "A max-heap is a complete binary tree where each parent node is greater than its children." 
                      : "A min-heap is a complete binary tree where each parent node is less than its children.";
    createBinaryTreeAndArray(heapArr);  // This function is now available globally
}

function createBSTVisualization(arr, inputMethod) {
    document.getElementById('visual-title').textContent = "Binary Search Tree Visualization";
    document.getElementById('instructions').textContent = 
        "In a binary search tree, left subtree values are smaller than the node, and right subtree values are larger.";
    
    if (inputMethod === 'levelOrder') {
        createBinaryTreeAndArray(arr);
    } else {
        createBinarySearchTree(arr);
    }
}

function createAVLVisualization(arr) {
    document.getElementById('visual-title').textContent = "AVL Tree Visualization";
    document.getElementById('instructions').textContent = 
        "An AVL tree is a self-balancing binary search tree where heights of left and right subtrees differ by at most 1.";
    
    const avlTree = new AVLTree();
    avlTree.buildFromLevelOrder(arr);
    const balancedArr = avlTree.toArray();
    createBinaryTreeAndArray(balancedArr);
}