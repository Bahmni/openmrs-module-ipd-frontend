import React from 'react'
import PropTypes from 'prop-types'
import { Header, HeaderMenuButton} from 'carbon-components-react'
import { Home24 } from "@carbon/icons-react"
import "./CareViewDashboard.scss"

export default function CareViewDashboard(props) {
    const { hostData } = props;
  return (
    <main className="care-view-page">
      <Header
          className="border-bottom-0 header-bg-color"
          aria-label="IBM Platform Name"
        >
          <HeaderMenuButton
            aria-label="Open menu"
            className="header-nav-toggle-btn"
          />
        </Header>
        <section className='main'>
          Hello
        </section>
    </main>
  )
}

CareViewDashboard.propTypes = {
    hostData: PropTypes.object.isRequired,
}
