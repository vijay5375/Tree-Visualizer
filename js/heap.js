function makeHeap(arr, type = 'max') {
    arr = [...arr]; // Create a copy of the array
    for (let i = Math.floor(arr.length / 2); i >= 0; i--) {
        heapifyDown(arr, arr.length, i, type);
    }
    return arr;
}

function heapifyDown(arr, length, index, type) {
    let leftChildIndex, rightChildIndex, targetIndex;

    while (true) {
        leftChildIndex = 2 * index + 1;
        rightChildIndex = 2 * index + 2;
        targetIndex = index;

        if (type === 'max') {
            if (leftChildIndex < length && arr[leftChildIndex] > arr[targetIndex]) {
                targetIndex = leftChildIndex;
            }
            if (rightChildIndex < length && arr[rightChildIndex] > arr[targetIndex]) {
                targetIndex = rightChildIndex;
            }
        } else { // min heap
            if (leftChildIndex < length && arr[leftChildIndex] < arr[targetIndex]) {
                targetIndex = leftChildIndex;
            }
            if (rightChildIndex < length && arr[rightChildIndex] < arr[targetIndex]) {
                targetIndex = rightChildIndex;
            }
        }

        if (targetIndex === index) {
            break;
        }

        swap(arr, index, targetIndex);
        index = targetIndex;
    }
}

function swap(arr, a, b) {
    [arr[a], arr[b]] = [arr[b], arr[a]];
}