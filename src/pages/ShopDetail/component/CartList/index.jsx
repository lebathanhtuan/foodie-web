import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  notification,
  Input,
  Space,
  Button,
  Modal,
  Badge,
  Radio,
  Form,
} from "antd";
import {
  PlusSquareOutlined,
  MinusSquareOutlined,
  PlusOutlined,
  MoneyCollectOutlined,
  BankOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";

import * as S from "./styles";
import { SHIP_FEE } from "./constants";
import { ROUTERS } from "../../../../constants/routers";
import AddAndChangeLocation from "./components/AddAndChangeLocation";
import {
  addToCartAction,
  reduceQuantityAction,
  removeFromCartAction,
  addPurchaseAction,
  clearCartAction,
} from "../../../../redux/actions";

const CartList = () => {
  const [visiblePaymentModal, setVisiblePaymentModal] = useState(false);
  const [visibleLoginNoticeModal, setVisibleLoginNoticeModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isHideAddLocation, setIsHideAddLocation] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [receiverInfoForm] = Form.useForm();

  const { id } = useParams();
  const { cartList } = useSelector((state) => state.cartReducer);
  const { userInfo } = useSelector((state) => state.userReducer);
  const { purchaseStatus } = useSelector((state) => state.purchaseReducer);
  const paymentLoading = purchaseStatus.loading;

  const cartListActive = cartList.data.filter(
    (product) => product.shopId === id
  );
  let totalPrice = 0;

  const handleIncreaseQuantity = (product) => {
    dispatch(
      addToCartAction({
        productId: product.productId,
        shopId: product.shopId,
      })
    );
  };

  const handleReduceQuantity = (product) => {
    dispatch(
      reduceQuantityAction({
        productId: product.productId,
        shopId: product.shopId,
      })
    );
  };

  const handleRemoveProduct = (product) => {
    dispatch(
      removeFromCartAction({
        productId: product.productId,
      })
    );
  };

  const handleClearCart = () => {
    dispatch(clearCartAction({ shopId: id }));
  };

  const handleOrderButton = () => {
    if (cartListActive.length === 0) {
      const emptyCartNotice = (type) => {
        notification[type]({
          message: "????n h??ng tr???ng",
          description:
            "B???n ch??a ch???n s???n ph???m n??o ????? ?????t h??ng, vui l??ng th??m s???n ph???m v??o gi??? h??ng",
        });
      };
      return emptyCartNotice("info");
    } else if (userInfo.data.id) {
      setVisiblePaymentModal(true);
    } else {
      setVisibleLoginNoticeModal(true);
    }
  };

  const handleFinishPayment = () => {
    if (
      !receiverInfoForm.getFieldsValue().fullName ||
      !receiverInfoForm.getFieldsValue().phoneNumber ||
      !userInfo.data.location
    ) {
      return notification.error({
        message: "Th??ng tin ng?????i nh???n kh??ng h???p l???",
        description: "Vui l??ng nh???p ?????y ????? th??ng tin",
      });
    } else {
      dispatch(
        addPurchaseAction({
          data: {
            cartList: cartListActive,
            shopId: id,
            paymentMethod,
            userId: userInfo.data.id,
            fullName: receiverInfoForm.getFieldsValue().fullName,
            phoneNumber: receiverInfoForm.getFieldsValue().phoneNumber,
            location: userInfo.data.location,
            shipFee: SHIP_FEE,
          },
          callback: {
            finishPayment: () => {
              setVisiblePaymentModal(false);
              dispatch(clearCartAction({ shopId: id }));
            },
          },
        })
      );
    }
  };

  const renderCartListActive = () => {
    return cartListActive.map((product) => {
      totalPrice = totalPrice + product.productPrice * product.quantity;
      return (
        <S.CartListItem key={product.productId}>
          <S.CartListItemDetail>
            <Space>
              <div>
                <PlusSquareOutlined
                  style={{ color: "green", paddingRight: "5px" }}
                  onClick={() => handleIncreaseQuantity(product)}
                />
                {product.quantity}
                <MinusSquareOutlined
                  style={{ paddingRight: "5px", paddingLeft: "5px" }}
                  onClick={() => handleReduceQuantity(product)}
                />
              </div>
              <S.CartListItemName>{product.productName}</S.CartListItemName>
            </Space>

            <Button
              size="small"
              danger
              onClick={() => handleRemoveProduct(product)}
            >
              X??a
            </Button>
          </S.CartListItemDetail>
          <S.CartListItemPrice>
            {(product.productPrice * product.quantity).toLocaleString()}???
          </S.CartListItemPrice>
        </S.CartListItem>
      );
    });
  };

  const renderCartListPayment = () => {
    return cartListActive.map((product) => {
      return (
        <Row gutter={16} key={product.productId} justify={"space-between"}>
          <Col>
            <Space>
              <Badge
                count={product.quantity}
                style={{
                  backgroundColor: "#52c41a",
                  verticalAlign: "baseline",
                }}
                size={"small"}
              />
              <span>{product.productName}</span>
            </Space>
          </Col>
          <Col>
            {(product.productPrice * product.quantity).toLocaleString()}???
          </Col>
        </Row>
      );
    });
  };

  return (
    <S.CartListContainer>
      <Row justify="space-around" align="middle">
        <Col>
          <S.CartListHeading>????n h??ng hi???n t???i</S.CartListHeading>
        </Col>
        <Col>
          <Button danger size="small" onClick={() => handleClearCart()}>
            X??a to??n b???
          </Button>
        </Col>
      </Row>

      {renderCartListActive()}
      <S.CartListTotalPrice>
        <Row gutter={16} justify={"space-between"}>
          <Col>T???ng c???ng</Col>
          <Col>
            <S.TotalPrice>{totalPrice.toLocaleString()}???</S.TotalPrice>
          </Col>
        </Row>
      </S.CartListTotalPrice>
      <S.PaymentButton>
        <Button type="primary" block onClick={() => handleOrderButton()}>
          ?????t h??ng
        </Button>
      </S.PaymentButton>

      <Modal
        title={<S.CartListHeading>X??c nh???n ????n h??ng </S.CartListHeading>}
        centered
        visible={visiblePaymentModal}
        onCancel={() => {
          setVisiblePaymentModal(false);
          receiverInfoForm.resetFields();
        }}
        width={1000}
        footer={
          <Button
            type="primary"
            onClick={() => handleFinishPayment()}
            block
            loading={paymentLoading}
          >
            Thanh to??n
          </Button>
        }
      >
        <Row gutter={16}>
          <Col span={14}>
            <S.CartListHeading>Th??ng tin ng?????i ?????t h??ng</S.CartListHeading>
            <Form
              form={receiverInfoForm}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{
                fullName: userInfo.data.fullName,
                phoneNumber: userInfo.data.phoneNumber,
              }}
            >
              <Form.Item
                label="H??? v?? t??n"
                name="fullName"
                rules={[{ required: true, message: "Vui l??ng nh???p h??? v?? t??n" }]}
              >
                <Input placeholder="Nh???p h??? v?? t??n" />
              </Form.Item>
              <Form.Item
                label="S??? ??i???n tho???i"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Vui l??ng nh???p s??? ??i???n tho???i" },
                ]}
              >
                <Input addonBefore="+84" placeholder="Nh???p s??? ??i???n tho???i" />
              </Form.Item>
            </Form>

            <Row gutter={[16, 16]}>
              <Col span={8}>
                <strong>?????a ch???:</strong>
              </Col>
              {userInfo.data.location ? (
                <Col span={16}>
                  <p>
                    {userInfo.data.location.address},{" "}
                    {userInfo.data.location.ward.name},{" "}
                    {userInfo.data.location.district.name},{" "}
                    {userInfo.data.location.city.name}
                  </p>
                  <Button
                    hidden={!isHideAddLocation}
                    onClick={() => setIsHideAddLocation(!isHideAddLocation)}
                  >
                    Thay ?????i ?????a ch???
                  </Button>
                </Col>
              ) : (
                <Col span={16}>
                  <Button
                    type="default"
                    icon={<PlusOutlined />}
                    block
                    onClick={() => setIsHideAddLocation(!isHideAddLocation)}
                    hidden={!isHideAddLocation}
                  >
                    Th??m ?????a ch???
                  </Button>
                </Col>
              )}
              <Col offset={8} span={16}>
                <div hidden={isHideAddLocation}>
                  <AddAndChangeLocation
                    setIsHideAddLocation={setIsHideAddLocation}
                  />
                </div>
              </Col>
              <Col span={8}>
                <strong>H??nh th???c thanh to??n:</strong>
              </Col>
              <Col span={16}>
                <Radio.Group
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <Space direction="vertical">
                    <Radio value={"cash"}>
                      <MoneyCollectOutlined />
                      Ti???n m???t
                    </Radio>
                    <Radio value={"banking"}>
                      <BankOutlined /> Internet banking
                    </Radio>
                    <Radio value={"eWallet"}>
                      <WalletOutlined /> V?? ??i???n t???
                    </Radio>
                  </Space>
                </Radio.Group>
              </Col>
            </Row>
          </Col>
          <Col span={10}>
            <S.CartListHeading>Chi ti???t ????n h??ng</S.CartListHeading>

            {renderCartListPayment()}
            <S.PaymentTotalPrice>
              <Row gutter={16} justify={"space-between"}>
                <Col>C???ng</Col>
                <Col>{totalPrice.toLocaleString()}???</Col>
              </Row>
              <Row gutter={16} justify={"space-between"}>
                <Col>Ph?? v???n chuy???n</Col>
                <Col>{SHIP_FEE.toLocaleString()}???</Col>
              </Row>
            </S.PaymentTotalPrice>
            <Row gutter={16} justify={"space-between"}>
              <Col>
                <S.PaymentPriceText>T???NG C???NG</S.PaymentPriceText>
              </Col>
              <Col>
                <S.PaymentPriceNumber>
                  {(totalPrice + SHIP_FEE).toLocaleString()}???
                </S.PaymentPriceNumber>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>

      <Modal
        centered
        visible={visibleLoginNoticeModal}
        title={<S.CartListHeading>B???n ch??a ????ng nh???p</S.CartListHeading>}
        onCancel={() => setVisibleLoginNoticeModal(false)}
        footer={
          <>
            <Button type="primary" onClick={() => navigate(ROUTERS.SIGN_IN)}>
              ????ng nh???p
            </Button>

            <Button onClick={() => setVisibleLoginNoticeModal(false)}>
              Quay l???i
            </Button>
          </>
        }
      >
        <p>B???n c???n ????ng nh???p ????? c?? th??? ti???p t???c ?????t h??ng</p>
      </Modal>
    </S.CartListContainer>
  );
};

export default CartList;
