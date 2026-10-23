// React 19's useId values depend on render order, which differs between
// environments. Normalise them so snapshots are stable.
const REACT_ID = /_r_[0-9a-z]+_/g;

module.exports = {
  test: (val) => typeof val === "string" && REACT_ID.test(val),
  serialize: (val, config, indentation, depth, refs, printer) =>
    printer(val.replace(REACT_ID, "_r_ID_"), config, indentation, depth, refs),
};
