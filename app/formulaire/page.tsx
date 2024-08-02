
"use client"
import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message, Select} from 'antd';
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
const FormPage : React.FC = () => {

    const [form] = Form.useForm();
    const onFinish = async (values: any) => {
        const { error } = await supabase
            .from('customers')
            .insert({
                nom: values.user.name,
                prenoms : values.user.surname,
                adresse:values.user.address ,
                telephone: values.user.phone,

            })
        form.resetFields();
        message.success('Votre commande à bien été ajouté').then(r => r);
    };
    return(
    <div className=" flex flex-col"  >
        <Form
            form={form}
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
            style={{ maxWidth: 600 , paddingTop:10 }}
            validateMessages={validateMessages}
        >
            <Form.Item name={['user', 'name']} label="Nom" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name={['user', 'surname']} label="Prénoms" >
                <Input />
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
export default FormPage;
