import React, { useEffect, useMemo } from "react";
import { Row, Col, Card, Skeleton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import * as S from "./styles";
import {
  getTopShopListAction,
  getNewShopListAction,
  getShopDetailAction,
} from "../../redux/actions";
import Header from "../../layouts/Header";
import Footer from "../../layouts/Footer";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTopShopListAction());
    dispatch(getNewShopListAction());
  }, []);

  const { serviceList } = useSelector((state) => state.serviceReducer);
  const { topShopList, newShopList } = useSelector(
    (state) => state.shopListReducer
  );
  console.log(newShopList.data);

  const renderServiceListButton = () => {
    return serviceList.data.map((service) => {
      return (
        <S.ServiceButton
          key={service.id}
          type="default"
          size="large"
          onClick={() => navigate(service.path)}
        >
          {service.name}
        </S.ServiceButton>
      );
    });
  };

  const renderTopShopList = useMemo(() => {
    if (topShopList.loading) return <Skeleton />;
    return topShopList.data.shops?.map((shop) => (
      <Col span={8} key={shop.id}>
        <Card
          size="small"
          hoverable
          cover={<img alt={shop.name} src={shop.image} />}
          onClick={() => {
            navigate(`/shop/${shop.id}`);
            dispatch(getShopDetailAction({ id: shop.id }));
          }}
        >
          <S.ShopsName title={shop.name}>{shop.name}</S.ShopsName>
          <S.ShopsAddress title={shop.address}>{shop.address}</S.ShopsAddress>
          <S.ShopsKind>{shop.kind}</S.ShopsKind>
        </Card>
      </Col>
    ));
  }, [topShopList.data]);

  const renderNewShopList = useMemo(() => {
    if (newShopList.loading) return <Skeleton />;
    return newShopList.data.shops?.map((shop) => (
      <Col span={8} key={shop.id}>
        <Card
          size="small"
          hoverable
          cover={<img alt={shop.name} src={shop.image} />}
          onClick={() => {
            navigate(`/shop/${shop.id}`);
            dispatch(getShopDetailAction({ id: shop.id }));
          }}
        >
          <S.ShopsName title={shop.name}>{shop.name}</S.ShopsName>
          <S.ShopsAddress title={shop.address}>{shop.address}</S.ShopsAddress>
          <S.ShopsKind>{shop.kind}</S.ShopsKind>
        </Card>
      </Col>
    ));
  }, [newShopList.data]);

  return (
    <S.Wrapper>
      <Header />
      <S.MainContainer>
        <S.MainBanner>
          <S.MainBannerContainer>
            <Row
              gutters={32}
              align="middle"
              justify="center"
              style={{ height: "100%" }}
            >
              <Col span={10}>
                <S.MainBannerTitle>Giao h??ng ch??? t??? 20'</S.MainBannerTitle>
                <S.ServiceButtonGroup>
                  {renderServiceListButton()}
                </S.ServiceButtonGroup>
              </Col>
              <Col span={14}>
                <S.ShopListContainer>
                  <S.ShopListContent>
                    <S.ShopListTittle>Qu??n n???i b???t</S.ShopListTittle>
                    <S.ShopList>
                      <Row gutter={[16, 16]}>{renderTopShopList}</Row>
                    </S.ShopList>
                  </S.ShopListContent>
                  <S.ShopListContent>
                    <S.ShopListTittle>Qu??n m???i</S.ShopListTittle>
                    <S.ShopList>
                      <Row gutter={[16, 16]}>{renderNewShopList}</Row>
                    </S.ShopList>
                  </S.ShopListContent>
                </S.ShopListContainer>
              </Col>
            </Row>
          </S.MainBannerContainer>
        </S.MainBanner>
      </S.MainContainer>
      <S.DeliveryContainer>
        <S.Heading>????n h??ng c???a b???n s??? ???????c b???o qu???n nh?? th??? n??o?</S.Heading>
        <S.DeliveryContent>
          Foodie s??? b???o qu???n ????n c???a b???n b???ng t??i & th??ng ????? ch???ng n???ng m??a, gi???
          nhi???t... tr??n ???????ng ??i m???t c??ch t???t nh???t.
          <S.DeliveryImage
            alt="delivery"
            src="http://localhost:3000/delivery-image.png"
          />
        </S.DeliveryContent>
      </S.DeliveryContainer>

      <S.AppContainer>
        <S.Heading>Foodie Merchant App</S.Heading>
        <S.AppContent>
          <p>
            - <strong>Foodie Merchant</strong> l?? ???ng d???ng qu???n l?? ????n h??ng cho
            c??c nh?? h??ng ?????i t??c c???a d???ch v??? ?????t m??n t???n n??i
          </p>
          <p>
            - <strong>Foodie</strong> lu??n s???n s??ng h???p t??c v???i c??c nh?? h??ng,
            qu??n ??n, cafe... ????? m??? r???ng kinh doanh c??ng nh?? gia t??ng kh??ch h??ng.
            H??y k???t n???i v??o h??? th???ng ?????t v?? giao h??ng ????? gi???m b???t chi ph?? qu???n
            l??, v???n h??nh, marketing, c??ng ngh???...
          </p>
          <p>
            ????ng k?? tham gia: <a href="#">t???i ????y</a>
          </p>

          <S.AppImage alt="app" src="http://localhost:3000/app-tutorial.png" />
        </S.AppContent>
      </S.AppContainer>
      <Footer />
    </S.Wrapper>
  );
};

export default Home;
