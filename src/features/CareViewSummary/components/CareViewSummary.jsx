import React, { useContext, useEffect, useState } from "react";
import "../styles/CareViewSummary.scss";
import { Tile, Link } from "carbon-components-react";
import { Dropdown } from "bahmni-carbon-ui";
import propTypes from "prop-types";
import _ from "lodash";
import {
  getSelectedWard,
  getSlidesPerView,
  getWardOptions,
  getWardSummary,
} from "../utils/CareViewSummary";
import { FormattedMessage } from "react-intl";
import { CareViewContext } from "../../../context/CareViewContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import {
  MOBILE_BREAKPOINT,
  TABLET_BREAKPOINT,
  WARD_SUMMARY_HEADER,
} from "../../../constants";

export const CareViewSummary = ({ callbacks, onHome }) => {
  const { setIsLoading } = callbacks;
  const [options, setOptions] = useState([]);
  const [screenSize, setScreenSize] = useState(window.outerWidth);
  const [isTabletView, setIsTabletView] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const {
    selectedWard,
    setSelectedWard,
    wardSummary,
    setWardSummary,
    headerSelected,
    setHeaderSelected,
    provider,
    refreshSummary,
  } = useContext(CareViewContext);

  let existingSelectedWards =
    JSON.parse(localStorage.getItem("selected_wards")) || {};

  const updateWardDetails = async () => {
    setIsLoading(true);
    const wardOptions = await getWardOptions();
    setOptions(wardOptions);
    const uuid = provider.uuid;
    const selectedWard = getSelectedWard(
      existingSelectedWards,
      uuid,
      wardOptions
    );
    setSelectedWard(selectedWard);
    if (selectedWard) {
      const wardSummaryResponse = await getWardSummary(
        selectedWard.value,
        uuid
      );
      setWardSummary(wardSummaryResponse);
    }
    setIsLoading(false);
  };

  const handleResize = () => {
    setScreenSize(window.outerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    updateWardDetails();
  }, []);

  useEffect(() => {
    if (!_.isEmpty(selectedWard)) {
      const newSelectedWard = {
        [provider.uuid]: selectedWard,
      };

      if (!existingSelectedWards) {
        existingSelectedWards = newSelectedWard;
      } else {
        existingSelectedWards = {
          ...existingSelectedWards,
          ...newSelectedWard,
        };
      }
      localStorage.setItem(
        "selected_wards",
        JSON.stringify(existingSelectedWards)
      );
      updateWardDetails();
    }
  }, [selectedWard, refreshSummary]);

  useEffect(() => {
    setIsTabletView(
      screenSize <= TABLET_BREAKPOINT && screenSize > MOBILE_BREAKPOINT
    );
    setIsMobileView(screenSize <= MOBILE_BREAKPOINT);
  }, [screenSize]);

  const totalPatientsTile = (
    <Tile
      className={`summary-tile ${
        headerSelected === WARD_SUMMARY_HEADER.TOTAL_PATIENTS &&
        "selected-header"
      }`}
      onClick={() => setHeaderSelected(WARD_SUMMARY_HEADER.TOTAL_PATIENTS)}
    >
      <span className={"heading-text"}>
        <FormattedMessage
          id={WARD_SUMMARY_HEADER.TOTAL_PATIENTS}
          defaultMessage={"Total patient(s)"}
        />
      </span>
      <span className={"value-text"}>{wardSummary.totalPatients || 0}</span>
    </Tile>
  );
  const myPatientsTile = (
    <Tile
      className={`summary-tile ${
        headerSelected === WARD_SUMMARY_HEADER.MY_PATIENTS && "selected-header"
      }`}
      onClick={() => setHeaderSelected(WARD_SUMMARY_HEADER.MY_PATIENTS)}
    >
      <span className={"heading-text"}>
        <FormattedMessage
          id={WARD_SUMMARY_HEADER.MY_PATIENTS}
          defaultMessage={"My patient(s)"}
        />
      </span>
      <span className={"value-text"}>
        {wardSummary.totalProviderPatients || 0}
      </span>
    </Tile>
  );
  return (
    <div className="care-view-summary">
      <Dropdown
        id="default"
        label="Dropdown menu options"
        options={options}
        onChange={(e) => {
          if (e) {
            setSelectedWard(e);
          }
        }}
        selectedValue={selectedWard}
        titleText={""}
        width={isMobileView ? "100%" : "200px"}
        placeholder={"Select a Ward"}
      />
      {!isTabletView && !isMobileView ? (
        <div className="summary-tiles">
          {totalPatientsTile}
          {myPatientsTile}
        </div>
      ) : (
        <Swiper
          pagination={true}
          modules={[Pagination]}
          slidesPerView={getSlidesPerView(isMobileView, isTabletView)}
          spaceBetween={"15px"}
        >
          <SwiperSlide>{totalPatientsTile}</SwiperSlide>
          <SwiperSlide>{myPatientsTile}</SwiperSlide>
        </Swiper>
      )}
      <Link className="ward-view-nav-link" onClick={onHome}>
        <FormattedMessage
          id={"WARD_LIST_VIEW_TEXT"}
          defaultMessage="Ward List View"
        />
      </Link>
    </div>
  );
};

CareViewSummary.propTypes = {
  callbacks: propTypes.object,
  onHome: propTypes.func,
};
