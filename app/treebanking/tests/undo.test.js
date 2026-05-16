/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';

// Polyfill structuredClone for Jest if missing
if (typeof globalThis.structuredClone !== 'function') {
  globalThis.structuredClone = (val) => JSON.parse(JSON.stringify(val));
}

import { undoButton, redoButton, saveState, clearStacks, undoStack, redoStack } from '../xml/undo.js';

describe("undoButton", () => {
  beforeEach(() => {
    clearStacks();
    window.treebankData = [];
    window.currentIndex = 0;
  });

  test ("does nothing if no changes are made to the heads", () => {
    redoButton();
    
    // Expect treebankData to stay the same
    expect(window.treebankData).toEqual([]);

    // Undo stack should be empty 
    expect(undoStack.length).toBe(0);

    // Redo stack should contain the mutated state
    expect(redoStack.length).toBe(0);
  })

  test("restores state after undoing once then redoing" , () => {
    saveState();  
    //mutate treebank
    window.treebankData = [{ id: "1", value: 1 }];

    // Perform undo
    undoButton();

    //Perform redo
    redoButton();

    // Expect treebankData restored to original
    expect(window.treebankData).toEqual([{ id: "1", value: 1 }]);

    // Undo stack should now be one
    expect(undoStack.length).toBe(1);

    // Redo stack should be empty
    expect(redoStack.length).toBe(0);
    expect(undoStack[0]).toEqual([]);
  });

  test("restores correct state after a sequence of undos followed by a redo", () => {
    saveState();

    // Mutate treebankData
    window.treebankData = [{ id: "1", value: 1 }];
    
    saveState();

    // Mutate treebankData
    window.treebankData = [{ id: "1", value: 2 }];

    // Perform undo
    undoButton();
    undoButton();

    //Perform redo 
    redoButton();

    // Expect treebankData restores to previously mutated version
    expect(window.treebankData).toEqual([{ id: "1", value: 1 }]);

    // Undo stack should now be one
    expect(undoStack.length).toBe(1);

    // Redo stack should be one
    expect(redoStack.length).toBe(1);
    expect(redoStack[0]).toEqual([{ id: "1", value: 2 }]);
  });

  test("restores correct state after a sequence of undos followed by a sequence of redos", () => {
    saveState();
    
    // Mutate treebankData
    window.treebankData = [{ id: "1", value: 1 }];
    
    saveState();

    // Mutate treebankData
    window.treebankData = [{ id: "1", value: 2 }];

    // Perform undo
    undoButton();
    undoButton();

    // Perfrom redo
    redoButton();
    redoButton();

    // Expect treebankData restored to mostly recently mutated version
    expect(window.treebankData).toEqual([{ id: "1", value: 2 }]);

    // Undo stack should now be two
    expect(undoStack.length).toBe(2);

    // Redo stack should be 0
    expect(redoStack.length).toBe(0);
    expect(undoStack).toEqual([
    [],
    [{ id: "1", value: 1 }]
  ]);

  });
});