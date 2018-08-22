import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { UserIsAuthenticated } from './util/wrappers.js'

// Layouts
import App from './App'
import Home from './layouts/home/Home'
import Dashboard from './layouts/dashboard/Dashboard'
import Verif from './layouts/verif/Verif'
import Tagsearch from './layouts/tagsearch/Tagsearch'
import Profile from './user/layouts/profile/Profile'
import Create_proof from './layouts/createProof/Create_proof'

// Redux Store
import store from './store'

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render((
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Home} />
          <Route path="verif" component={UserIsAuthenticated(Verif)} />
          <Route path="tagsearch" component={UserIsAuthenticated(Tagsearch)} />
          <Route path="dashboard" component={UserIsAuthenticated(Dashboard)} />
          <Route path="profile" component={UserIsAuthenticated(Profile)} />
          <Route path="createProof" component={UserIsAuthenticated(Create_proof)} />
        </Route>
      </Router>
    </Provider>
  ),
  document.getElementById('root')
)
