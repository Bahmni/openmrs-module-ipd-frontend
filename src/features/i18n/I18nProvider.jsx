import PropTypes from "prop-types";

export function I18nProvider({ children }) {
  return children;
}

I18nProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
