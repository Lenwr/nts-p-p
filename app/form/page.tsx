
"use client"
import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Select} from 'antd';
import {supabase} from "@/utils/supabase/client";
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};



/* eslint-disable no-template-curly-in-string */
const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not a valid email!',
        number: '${label} is not a valid number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};
/* eslint-enable no-template-curly-in-string */
const [form] = Form.useForm();
const onFinish = async (values: any) => {
    const { error } = await supabase
        .from('customers')
        .insert({
            nom: values.user.name,
            prenoms : values.user.surname,
            adresse:values.user.address ,
            telephone: values.user.phone
        })
    form.resetFields();
    console.log(values);
};

const Page : React.FC = () => {


    const [country , setCountry] = useState()
    const handleChange = (e:any) => {
    };
    return(
    <div className="p-6 flex flex-col"  >
        <text className="p-6 bg-blue-600 text-white rounded-2xl shadow-2xl my-4">Enregistrer un client </text>
        <Form
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
            style={{ maxWidth: 600 , paddingTop:50 }}
            validateMessages={validateMessages}
        >
            <Form.Item name={['user', 'name']} label="Nom" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name={['user', 'surname']} label="Prénoms" >
                <Input />
            </Form.Item>
            <Form.Item label="Pays" name={['user', 'country']}>
                <Select
                    defaultValue="Togo"
                    style={{ maxWidth: 600 }}
                    onChange={handleChange}
                    options={[
                        { value: 'Togo', label: 'Togo' },
                        { value: 'Senegal', label: 'Senegal' },
                        { value: 'Mali', label: 'Mali' },
                    ]}
                />
            </Form.Item>
            <Form.Item name={['user', 'address']} label="Adresse" >
                <Input />
            </Form.Item>
            <Form.Item name={['user', 'phone']} label="Telephone" >
                <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                    Enregistrer
                </Button>
            </Form.Item>
        </Form>
    </div>
    )
};
export default Page;
