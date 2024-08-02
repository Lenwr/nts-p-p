"use client"

import React, {useEffect, useState} from 'react';
import {DeleteOutlined, FileAddOutlined, PlusOutlined, SettingOutlined, SunFilled} from '@ant-design/icons';
import {Dropdown, Form, Input, MenuProps, Select} from 'antd';
import {FloatButton} from "antd";
import {Button, Modal, Space} from 'antd';
import {supabase} from "@/utils/supabase/client";
import {Card} from 'antd';
import ArticlePage from "@/app/articles/page";
import AddArticlePage from "@/app/addArticle/page";
import Meta from "antd/es/card/Meta";
import type {PopconfirmProps} from 'antd';
import {message, Popconfirm} from 'antd';


const {confirm} = Modal;
const {Option} = Select;
const items: MenuProps['items'] = [
    {
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                En attente de réception
            </a>
        ),
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                Réceptionné
            </a>
        ),
    },
    {
        key: '3',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                Envoyé
            </a>
        ),
    },
    {
        key: '4',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                Retrait effectué
            </a>
        ),
    },
];

const Page = ({params,}: {
    params: { commande: string };
}) => {
    const [form] = Form.useForm();
    const [orders, setOrders] = useState<any[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const fetchOrders = async () => {
            const order_id = params.commande
            try {
                const {data, error} = await supabase
                    .from('commandes')
                    .select('id ,numero_commande , created_at, statut_commande')
                    .eq('client_id', order_id);
                if (error) {
                    console.error(error);
                } else {
                    setOrders(data);
                }
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchOrders().then(r => r);
    }, []);
    const showPromiseConfirm = () => {
        confirm({
            title: 'Créer une nouvelle commande',
            icon: <SunFilled/>,
            content: 'Veuillez appuyer sur "OK" pour créer une nouvelle commande ',
            onOk() {
                return new Promise((resolve, reject) => {
                    const clientId: string = params.commande
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);

                    async function createOrder() {
                        try {
                            // Récupérer le numéro de commande le plus élevé pour le client
                            const {data: existingOrders, error: fetchError} = await supabase
                                .from('commandes')
                                .select('numero_commande')
                                .eq('client_id', clientId)
                                .order('numero_commande', {ascending: false})
                                .limit(1);

                            if (fetchError) throw fetchError;

                            // Déterminer le prochain numéro de commande
                            const nextOrderNumber = existingOrders.length > 0 ? existingOrders[0].numero_commande + 1 : 1;

                            // Créer la nouvelle commande avec le numéro séquentiel
                            const {data, error: insertError} = await supabase
                                .from('commandes')
                                .insert([{client_id: clientId, numero_commande: nextOrderNumber , statut_commande: 'En attente'}])
                                .single();

                            if (insertError) throw insertError;

                            return data;
                        } catch (error) {
                            console.error('Erreur lors de la création de la commande:');
                            throw error;
                        }
                    }

                    createOrder()
                })
                    .then(() => {
                        message.success('Votre commande à bien été crée').then(r => r);
                    })
                    .catch(() => console.log('Oops errors!'));
            },
            onCancel() {
            },
        });
    };

    const confirmDelete: PopconfirmProps['onConfirm'] = async (idToPass) => {
        return new Promise<void>(async (resolve, reject) => {
            const response = await supabase
                .from('articles')
                .delete()
                .eq('commande_id', idToPass)
            resolve();
        })
            .then(async () => {
                const response = await supabase
                    .from('commandes')
                    .delete()
                    .eq('id', idToPass)
                message.success('commande supprimée');
            })
    };

    const cancelDelete: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
        message.error('vous avez cliqué sur oui');
    };

    function formatDate(dateString: string): string {
        const date = new Date(dateString);

        // Extraire les différentes parties de la date
        const dayOfWeek = new Intl.DateTimeFormat('fr-FR', {weekday: 'long'}).format(date);
        const day = date.getUTCDate();
        const month = new Intl.DateTimeFormat('fr-FR', {month: 'long'}).format(date);
        const year = date.getUTCFullYear();
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();


        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${dayOfWeek} ${day} ${month} ${year} à ${formattedHours}h${formattedMinutes}`;
    }

    const [status , setStatus] = useState('')
    const handleChange = (value:string) => {
        setStatus(value)
    }
    const onFinish = async (item:any) => {
        const { error } = await supabase
            .from('commandes')
            .update({ statut_commande: status })
            .eq('id', item)
        message.success('Status mis à jour');
    };

    return (
        <div className="w-full p-6">
            <h1>Commandes</h1>
            <div>
                {
                    orders.map((item ,index) => (
                        <div key={index} className="my-3">
                            <h1 className="text-center text-l bg-[#364d79] py-2 text-white bg-gray-500">{(formatDate(item.created_at))}</h1>
                            <h1 className="text-center text-l bg-[#364d79] py-2 text-white bg-gray-500">{item.statut_commande}</h1>
                            <Card
                                style={{width: '100%'}}
                                title={''}
                                actions={[
                                    <FileAddOutlined
                                        onClick={() => {
                                            Modal.confirm({
                                                title: 'Créer un nouvel article',
                                                content: <AddArticlePage data={item.id}/>,
                                                footer: (_, {OkBtn, CancelBtn}) => (
                                                    <>
                                                        <CancelBtn/>
                                                    </>
                                                ),
                                            });
                                        }}/>,
                                    <Space.Compact style={{ width: '100%' }}>
                                        <Input defaultValue={item.id} />
                                    </Space.Compact>
                                ]}
                                extra={<div className="flex justify-between flex-row">
                                    <Form
                                        form={form}
                                        name="nest-messages"
                                        onFinish={()=>{onFinish(item.id)}}
                                        style={{ maxWidth: 'auto' , marginRight:"50" , display:"flex", flexDirection:"row" ,justifyItems:'between',marginTop:20 }}
                                    >
                                        <Form.Item label="" >
                                            <Select
                                                className="mr-4"
                                                defaultValue="statut"
                                                style={{width: 120}}
                                                onChange={handleChange}
                                                options={[
                                                    {value: 'Réceptionné', label: 'Réceptionné'},
                                                    {value: 'Envoyé', label: 'Envoyé'},
                                                    {value: 'Retrait effectué', label: 'Retrait effectué'},
                                                ]}
                                            />
                                        </Form.Item>
                                        <Form.Item className="mx-4">
                                            <Button type="primary" htmlType="submit">
                                               Changer
                                            </Button>
                                        </Form.Item>
                                        <Popconfirm
                                            title="Supprimer la commande"
                                            description="Etes vous sur de vouloir supprimer cette commande ?"
                                            onConfirm={() => {
                                                confirmDelete(item.id)
                                            }}
                                            onCancel={cancelDelete}
                                            okText="Oui"
                                            cancelText="Non"
                                        >
                                            <Button danger><DeleteOutlined/></Button>
                                        </Popconfirm>
                                    </Form>
                                </div>
                                }
                                tabProps={{
                                    size: 'middle',
                                }}
                            >
                                <Meta description={<ArticlePage idArticle={item.id}/>}/>
                            </Card>
                        </div>
                    ))
                }
            </div>
            <div>
            </div>
            <div>
                <FloatButton onClick={showPromiseConfirm} icon={<PlusOutlined/>}/>
            </div>
            <div>
            </div>
        </div>
    );
};
export default Page;
