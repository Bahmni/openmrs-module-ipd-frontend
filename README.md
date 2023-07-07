# IPD frontend for OpenMRS

A react micro-frontend to be loaded by Bahmni frontend for In Patient Department modules

## Architecture

This micro-frontend is built using Webpack's ModuleFederation plugin. Due to constraints on the _Bahmni_ side of things,
the `webpack.config.js` contains 2 separate configurations, one for the federated module and the other for local development.

### Entries

Currently, one component is exposed as an entry for the federated module (`src/entries/Dashboard.jsx`). Future entries should be added to `src/entries/`
folder and then exposed using the `exposes: {...}` key in the ModuleFederationPlugin config of `webpack.config.js`.

### Sandboxed development

The following command loads the `src/entries/Dashboard.jsx` in a sandboxed view for local development. This view is fed with dummy data which
can be modified in `src/index.js`

```
yarn dev:sandbox
```

### Integrated development

Running the following builds and watches the `dist/federation/` folder which can be served by an apache container for access by `bahmni`.

```
yarn dev:integrated
```

This builds the `remoteEntry.js` file which exposes the entries as specified in the ModuleFederationPlugin config
