import React, { useEffect } from "react";
import { Form, Input, Button, Select, notification, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";

import {
  getCityListAction,
  getDistrictListAction,
  getWardListAction,
  updateUserInfoAction,
} from "../../../../../../redux/actions";

const AddAndChangeLocation = ({ setIsHideAddLocation }) => {
  const dispatch = useDispatch();

  const [locationForm] = Form.useForm();

  useEffect(() => {
    dispatch(getCityListAction());
  }, []);

  const { cityList, districtList, wardList } = useSelector(
    (state) => state.locationReducer
  );
  const { userInfo } = useSelector((state) => state.userReducer);
  const userId = userInfo.data.id;

  const renderCityOptions = () => {
    return cityList.data.map((cityItem) => {
      return (
        <Select.Option key={cityItem.id} value={cityItem.code}>
          {cityItem.name}
        </Select.Option>
      );
    });
  };

  const renderDistrictOptions = () => {
    return districtList.data.map((districtItem) => {
      return (
        <Select.Option key={districtItem.id} value={districtItem.code}>
          {districtItem.name}
        </Select.Option>
      );
    });
  };

  const renderWardOptions = () => {
    return wardList.data.map((wardItem) => {
      return (
        <Select.Option key={wardItem.id} value={wardItem.code}>
          {wardItem.name}
        </Select.Option>
      );
    });
  };

  const handleChangeLocation = (values) => {
    const { city, district, ward, address } = values;
    const cityName = cityList.data.find(
      (cityItem) => cityItem.code === city
    ).name;
    const districtName = districtList.data.find(
      (districtItem) => districtItem.code === district
    ).name;
    const wardName = wardList.data.find(
      (wardItem) => wardItem.code === ward
    ).name;
    const location = {
      city: {
        code: city,
        name: cityName,
      },
      district: {
        code: district,
        name: districtName,
      },
      ward: {
        code: ward,
        name: wardName,
      },
      address,
    };
    dispatch(
      updateUserInfoAction({
        id: userId,
        location,
      })
    );
    notification.success({
      message: "Thay ?????i th??nh c??ng",

      description: "?????a ch??? c???a b???n ???? ???????c thay ?????i",
    });
    locationForm.resetFields();
    setIsHideAddLocation(true);
  };

  return (
    <Form
      form={locationForm}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={(values) => handleChangeLocation(values)}
    >
      <Form.Item
        label="T???nh/Th??nh ph???"
        name="city"
        rules={[
          {
            required: true,
            message: "Vui l??ng ch???n T???nh/Th??nh ph??? c???a b???n",
          },
        ]}
      >
        <Select
          allowClear
          onChange={(value) => {
            dispatch(getDistrictListAction({ cityCode: value }));
            locationForm.setFieldsValue({ district: undefined });
            locationForm.setFieldsValue({ ward: undefined });
          }}
        >
          {renderCityOptions()}
        </Select>
      </Form.Item>

      <Form.Item
        label="Qu???n/Huy???n"
        name="district"
        rules={[
          {
            required: true,
            message: "Vui l??ng ch???n Qu???n/Huy???n c???a b???n",
          },
        ]}
      >
        <Select
          allowClear
          onChange={(value) => {
            dispatch(getWardListAction({ districtCode: value }));
            locationForm.setFieldsValue({ ward: undefined });
          }}
        >
          {renderDistrictOptions()}
        </Select>
      </Form.Item>

      <Form.Item
        label="Ph?????ng/X??"
        name="ward"
        rules={[
          {
            required: true,
            message: "Vui l??ng ch???n Ph?????ng/X?? c???a b???n",
          },
        ]}
      >
        <Select allowClear>{renderWardOptions()}</Select>
      </Form.Item>

      <Form.Item
        label="?????a ch??? c??? th???"
        name="address"
        rules={[
          {
            required: true,
            message: "Vui l??ng nh???p ?????a ch??? c??? th??? c???a b???n!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
        <Space>
          <Button type="primary" htmlType="submit">
            Thay ?????i
          </Button>
          <Button onClick={() => setIsHideAddLocation(true)}>H???y</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddAndChangeLocation;
