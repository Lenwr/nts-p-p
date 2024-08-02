
"use client"
import React, {FC, useEffect, useState} from 'react';
import {Button, Form, Input, Select, Upload, UploadFile, UploadProps} from 'antd';
import {supabase} from "@/utils/supabase/client";
import {UploadOutlined} from "@ant-design/icons";
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
    const [imageUrl, setImageUrl] = useState<string>("");
    const [country , setCountry] = useState<string>('')

    useEffect(() => {
        setCountry(country);
    }, []);
    async function handleChange (e:any) {
        setCountry(e)
    };


    const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {

        try {
             if (!e.target.files || e.target.files.length === 0) {
                 throw new Error('You must select an image to upload.');
             }
             const file = e.target.files[0];

             const { data: image, error: uploadError } = await supabase.storage
                 .from('articles')
                 .upload(`${file.name}`, file ,{upsert: true});

             if (uploadError) {
                 throw uploadError;
             }

             if (image) {
                 console.log(image);
             }

             const { data: imgUrl } =  supabase.storage
                 .from('articles')
                 .getPublicUrl(`${file.name}` ?? 'default');

             if (imgUrl) {
                 setImageUrl(imgUrl.publicUrl);
                 console.log(imageUrl)
             }
         } catch (error) {
             console.log(error);
         }
    };

    const onFinish = async (values: any) => {
        const { error } = await supabase
            .from('articles')
            .insert({
                commande_id:props.data ,
                nom_article: values.user.name,
                numero_destinataire: values.user.phone,
                prix_article : values.user.prix,
                commentaire:values.user.commentaire ,
                destinataire:values.user.receiver,
                country:country,
                imageUrl:imageUrl
            })
        setCountry('')
        form.resetFields();
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
                <Form.Item name={['user', 'receiver']} label="Destinataire" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'phone']} label="Telephone" rules={[{ required: true }]}>
                    <Input  type='number'/>
                </Form.Item>
                <Form.Item label="Pays de Destination" >
                    <Select
                        defaultValue="choisir"
                        style={{ maxWidth: 600 }}
                        onChange={handleChange}
                        options={[
                            { value: 'Togo', label: 'Togo' },
                            { value: 'Senegal', label: 'Senegal' },
                            { value: 'Mali', label: 'Mali' },
                        ]}
                    />
                </Form.Item>
                <Form.Item name={['user', 'name']} label="Designation" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'commentaire']} label="Commentaires" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name={['user', 'image']} label="Photos" rules={[{ required: true }]}>
                 <Input type="file"
                        onChange={uploadImage}/>
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
