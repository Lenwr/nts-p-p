"use client"
import {Button, Drawer, FloatButton, message, Popconfirm, PopconfirmProps, Select, Space, Table, Tag} from 'antd';
import type { TableProps } from 'antd';
import React, {useEffect, useState} from 'react';
import {supabase} from "@/utils/supabase/client";
import { useRouter } from 'next/navigation'
import FormPage from "@/app/formulaire/page";
import {DeleteOutlined, PlusOutlined, UserAddOutlined} from "@ant-design/icons";
interface DataType {
    nom: string;
    prenoms: string;
    adresse: string;
    country: string;
    telephone:string ,
    id: string
}
const { Option } = Select;

const Page: React.FC = () => {
    const router = useRouter();
    const [customers , setCustomers] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const navigateTo = async (id: string) => {
      await router.push(`/commandes/${id}`);
    };

    const Delete  =  async (idToDelete : any) => {
        return new Promise<void>(async (resolve, reject) => {
            const response = await supabase
                .from('customers')
                .delete()
                .eq('id', idToDelete)
            console.log('loading')
            resolve();
        }).then(()=>{
            message.success('Votre commande à bien été supprimé').then(r => r);
        })
    };

    const cancelDelete: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
        message.error('vous avez cliqué sur oui');
    };
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const { data, error } = await supabase
                    .from('customers')
                    .select('nom , prenoms , adresse ,country , telephone , id');
                if (error) {
                    console.error(error);
                } else {
                    setCustomers(data);
                }
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchCustomers();
    }, [customers]);
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Nom',
            dataIndex: 'nom',
            key:'nom',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Prénoms',
            dataIndex: 'prenoms',
            key:'prenoms',
        },
        {
            title: 'Addresse',
            dataIndex: 'adresse',
            key:'adresse',
        },
        {
            title: 'Téléphone',
            dataIndex: 'telephone',
            key:'telephone',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a className="p-2 bg-blue-400 rounded-md text-white" onClick={()=>{navigateTo(record.id)}} >commandes</a>
                    <Button danger className="p-2  rounded-md text-white" onClick={async ()=>{ await Delete(record.id)}} ><DeleteOutlined /></Button>
                </Space>
            ),
        },
    ];

    const data: DataType[] = customers
    return (
        <div className="bg-blue-400 min-w-full min-h-full p-2">
            <Table columns={columns} dataSource={data} />

            <Drawer
                title="Ajouter un nouveau client "
                width={400}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                    },
                }}
                extra={
                    <Space>
                    </Space>
                }
            >
             <FormPage />
            </Drawer>
            <FloatButton
                shape="circle"
                type="primary"
                onClick={showDrawer}
                style={{ top: 40 , right: 40 }}
                icon={<UserAddOutlined />}
            />
        </div>
    );
}

export default Page;
