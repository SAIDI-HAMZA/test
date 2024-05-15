type Filters = Record<string, Array<string> | string>;

export class FilterFactory {
  filters: null | Filters = null;
  constructor(params: Filters) {
    this.filters = params;
  }

  parse() {
    if (!this.filters) return {};
    return Object.fromEntries(
      Object.entries(this.filters).map(([key, value]) => [
        key,
        { [Array.isArray(value) ? 'in' : 'equals']: value },
      ])
    );
  }
}
