/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Subject } from 'rxjs';

export interface MarkedItems<T> {
  containSelected: boolean;
  markedItems: T[];
}


/**
 * Class to be used to power selecting one or more options from a list.
 */
export class MarkedModel<T> {

  /** Currently-selected values. !!Change Set by Map!! */
  private _markation = new Map<string, T>();
  private _containsSelected = true;

  /** Keeps track of the deselected options that haven't been emitted by the change event. */
  private _unmarkededToEmit: T[] = [];

  /** Keeps track of the selected options that haven't been emitted by the change event. */
  private _markedToEmit: T[] = [];

  /** Cache for the array value of the selected items. */
  private _marked: T[] | null;

  /** Selected values. */
  get marked(): MarkedItems<T> {
    if (!this._marked) {
      this._marked = Array.from(this._markation.values());
    }
    return {
      containSelected: this._containsSelected,
      markedItems: this._marked
    };
  }

  /** Event emitted when the value has changed. */
  onChange: Subject<MarkationChange<T>> | null = this._emitChanges ? new Subject() : null;

  constructor(
    private _multiple = false,
    initiallyMarkedValues?: T[],
    private _emitChanges = true,
    private _keyField = 'id') {

    if (initiallyMarkedValues && initiallyMarkedValues.length) {
      if (_multiple) {
        initiallyMarkedValues.forEach(value => this._markSelected(value));
      } else {
        this._markSelected(initiallyMarkedValues[0]);
      }

      // Clear the array in order to avoid firing the change event for preselected values.
      this._markedToEmit.length = 0;
    }
  }

  /**
   * Mark a value or an array of values.
   */
  mark(...values: T[]): void {
    this._verifyValueAssignment(values);
    values.forEach(value => this._markSelected(value));
    this._emitChangeEvent();
  }

  /**
   * Mark a value or an array of values.
   */
  unmark(...values: T[]): void {
    this._verifyValueAssignment(values);
    values.forEach(value => this._unmarkSelected(value));
    this._emitChangeEvent();
  }

  /**
   * Toggles a value between selected and deselected.
   */
  toggle(value: T): void {
    this.isMarked(value) ? this.unmark(value) : this.mark(value);
  }

  /**
   * Clears all of the selected values.
   */
  clear(): void {
    this._unmarkAll();
    this._emitChangeEvent();
  }

  reverse(): void {
    this._containsSelected = !this._containsSelected;
  }

  /**
   * Determines whether a value is marked.
   */
  isMarked(value: T): boolean {
    if (this._containsSelected) {
      return this._markation.has(value[this._keyField]);
    } else {
      return !this._markation.has(value[this._keyField]);
    }

  }

  /**
   * Determines whether the model does not have a value.
   */
  isEmpty(): boolean {
    if (this._containsSelected) {
      return this._markation.size === 0;
    } else {
      return this._markation.size !== 0;
    }
  }

  /**
   * Determines whether the model has a value.
   */
  hasValue(): boolean {
    if (this._containsSelected) {
      return !this.isEmpty();
    } else {
      return this.isEmpty();
    }
  }

  /**
   * Gets whether multiple values can be selected.
   */
  isMultipleSelection() {
    return this._multiple;
  }

  /** Emits a change event and clears the records of selected and deselected values. */
  private _emitChangeEvent() {
    // Clear the selected values so they can be re-cached.
    this._marked = null;

    if (this._markedToEmit.length || this._unmarkededToEmit.length) {
      if (this.onChange) {
        this.onChange.next({
          source: this,
          added: this._markedToEmit,
          removed: this._unmarkededToEmit
        });
      }

      this._unmarkededToEmit = [];
      this._markedToEmit = [];
    }
  }

  /** Selects a value. */
  private _markSelected(value: T) {
    if (!this.isMarked(value)) {
      if (!this._multiple) {
        this._unmarkAll();
      }

      this._markation.set(value[this._keyField], value);

      if (this._emitChanges) {
        this._markedToEmit.push(value);
      }
    }
  }

  /** Deselects a value. */
  private _unmarkSelected(value: T) {
    if (this.isMarked(value)) {
      this._markation.delete(value[this._keyField]);
      if (this._emitChanges) {
        this._unmarkededToEmit.push(value);
      }
    }
  }

  /** Clears out the selected values. */
  private _unmarkAll() {
    if (!this.isEmpty()) {
      this._markation.clear();
    }
  }

  /**
   * Verifies the value assignment and throws an error if the specified value array is
   * including multiple values while the selection model is not supporting multiple values.
   */
  private _verifyValueAssignment(values: T[]) {
    if (values.length > 1 && !this._multiple) {
      throw getMultipleValuesInSingleSelectionError();
    }
  }
}

/**
 * Event emitted when the value of a MatMarkedModelMap has changed.
 * @docs-private
 */
export interface MarkationChange<T> {
  /** Model that dispatched the event. */
  source: MarkedModel<T>;
  /** Options that were added to the model. */
  added: T[];
  /** Options that were removed from the model. */
  removed: T[];
}

/**
 * Returns an error that reports that multiple values are passed into a selection model
 * with a single value.
 */
export function getMultipleValuesInSingleSelectionError() {
  return Error('Cannot pass multiple values into MarkedModel with single-value mode.');
}
