import React, { useEffect, useState } from "react";
import { Header, Footer } from "../../components/template";
import { Row, Col, Container } from "reactstrap";
import { BellOutlined } from "@ant-design/icons";
import { Switch, Route, Link, Redirect, useRouteMatch } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import "./style.scss";

import mail from "../../assets/images/supportpage/mail_open.png";
import security from "../../assets/images/supportpage/security.png";
import user from "../../assets/images/supportpage/user.png";
import movie1 from "../../assets/images/supportpage/movie1.png";
import movie2 from "../../assets/images/supportpage/movie2.png";
import movie3 from "../../assets/images/supportpage/movie3.png";
import movie4 from "../../assets/images/supportpage/movie4.png";
import Personal from "./personal";
import Password from "./password";
import Notifications from "./notifications";
import Invite from "./invite";

function SupportPage({ location }) {
  let resizeWindow = () => {
    setWindowWidth(window.innerWidth);
  };
  const [windowWidth, setWindowWidth] = useState(0);
  useEffect(() => {
    resizeWindow();
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);

  let { path, url } = useRouteMatch();
  const isMobile = windowWidth <= 640 ? true : false;
  const isShowMenu = location.pathname === "/support" && isMobile;
  console.log('is dhow', isShowMenu)
  return (
    <div style={{ backgroundColor: "#000" }}>
      <Header />
      <div className="support-wrapper">
        <div className="support-container">
          <Container fluid>
            <Row>
              <Col
                md={3}
                sm={12}
                lg={3}
                className={`support-first support-pd2 ${
                  !isShowMenu && "d-none d-lg-block d-md-block"
                }`}
                style={{ color: "white" }}
              >
                <div className="support-setting">SETTINGS</div>
                <div className="support-menu">
                  <Link to={`${url}/personal`}>
                    <div className="support-item">
                      <img
                        src={user}
                        className="support-item-img"
                        alt="personal information"
                      />
                      <div className="support-item-txt">
                        Personal Information
                      </div>
                    </div>
                  </Link>
                  <Link to={`${url}/password`}>
                    <div className="support-item">
                      <img
                        src={security}
                        className="support-item-img"
                        alt="password"
                      />
                      <div className="support-item-txt">
                        Password & Security
                      </div>
                    </div>
                  </Link>
                  <Link to={`${url}/notifications`}>
                    <div className="support-item">
                      <BellOutlined
                        style={{ fontSize: "22px" }}
                        className="support-item-img"
                        alt="notifications"
                      />
                      <div className="support-item-txt">Notifications</div>
                    </div>
                  </Link>
                  <Link to={`${url}/invite`}>
                    <div className="support-item">
                      <img
                        src={mail}
                        className="support-item-img"
                        alt="invite"
                      />
                      <div className="support-item-txt">Invite Friends</div>
                    </div>
                  </Link>
                </div>
              </Col>
              <Col
                md={9}
                sm={12}
                lg={6}
                className={`support-second support-pt3 ${
                  isShowMenu && "d-none d-lg-block"
                }`}
              >
                <Switch>
                  <Route path={`${path}/personal`}>
                    <Personal />
                  </Route>
                  <Route path={`${path}/password`}>
                    <Password />
                  </Route>
                  <Route path={`${path}/notifications`}>
                    <Notifications />
                  </Route>
                  <Route path={`${path}/invite`}>
                    <Invite />
                  </Route>
                  {!isMobile && (
                    <Route path={path}>
                      <Redirect to={`${path}/personal`} />
                    </Route>
                  )}
                </Switch>
              </Col>
              <Col
                md={3}
                sm={12}
                lg={3}
                className="support-third d-none d-lg-block d-md-none"
              >
                <img src={movie1} alt="movie1" className="support-img" />
                <img src={movie2} alt="movie2" className="support-img" />
                <img src={movie3} alt="movie3" className="support-img" />
                <img src={movie4} alt="movie4" className="support-img" />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SupportPage;
