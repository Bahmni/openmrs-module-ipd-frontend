import React, { useContext, useEffect, useState } from "react";
import "../styles/CareViewSummary.scss";
import { Tile, Link } from "carbon-components-react";
import { Dropdown } from "bahmni-carbon-ui";
import propTypes from "prop-types";
import _ from "lodash";
import {
  fetchWardSummary,
  getSlidesPerView,
  getWardDetails,
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
export const CareViewSummary = (props) => {
  const { callbacks, onHome } = props;
  const [options, setOptions] = useState([]);
  const [screenSize, setScreenSize] = useState(window.outerWidth);
  const [isTabletView, setIsTabletView] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const setWindowWidth = () => {
    setScreenSize(window.outerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", setWindowWidth);
    return () => {
      window.removeEventListener("resize", setWindowWidth);
    };
  }, []);
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

  const localSelectedWard = JSON.parse(
    localStorage.getItem("selected_ward")
  )?.label;

  const getWardList = async () => {
    callbacks.setIsLoading(true);
    const wardList = await getWardDetails();
    const wardOptions = wardList?.map((ward) => {
      return {
        label: ward?.ward?.display,
        value: ward?.ward?.uuid,
      };
    });
    setOptions(wardOptions);
    if (localSelectedWard) {
      setSelectedWard(
        wardOptions.find((ward) => ward.label === localSelectedWard)
      );
    } else {
      setSelectedWard(wardOptions[0]);
    }
    callbacks.setIsLoading(false);
  };
  const getWardSummary = async () => {
    callbacks.setIsLoading(true);
    const response = await fetchWardSummary(selectedWard.value, provider.uuid);
    if (response.status === 200) {
      setWardSummary(response.data);
    } else {
      setWardSummary({});
    }
    callbacks.setIsLoading(false);
  };
  useEffect(() => {
    getWardList();
  }, []);
  useEffect(() => {
    if (!_.isEmpty(selectedWard)) {
      localStorage.setItem("selected_ward", JSON.stringify(selectedWard));
      getWardSummary();
    }
  }, [selectedWard, refreshSummary]);
  useEffect(() => {
    setIsTabletView(false);
    setIsMobileView(false);
    if (screenSize <= MOBILE_BREAKPOINT) {
      setIsMobileView(true);
    } else if (screenSize <= TABLET_BREAKPOINT) {
      setIsTabletView(true);
    }
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
