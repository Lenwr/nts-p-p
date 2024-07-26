
"use client"
import React, {FC, useEffect, useState} from 'react';
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
const AddArticlePage = (props:any) => {
    const [form] = Form.useForm();
    const onFinish = async (values: any) => {
        const { error } = await supabase
            .from('articles')
            .insert({
                commande_id:props.data ,
                nom_article: values.user.name,
                prix_article : values.user.prix,
                quantite:values.user.quantite ,
            })
        form.resetFields();
        console.log(values);
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
                <Form.Item name={['user', 'name']} label="Designation" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'quantite']} label="Quantité" >
                    <Input type="number" />
                </Form.Item>
                <Form.Item label="Prix" name={['user', 'prix']}>
                    <Input type="number" />
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
export default AddArticlePage;
