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
    key: string
}

const Page: React.FC = () => {
    const router = useRouter();
    const [customers , setCustomers] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [reload, setReload] = useState(false);

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
    }, []);
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Nom',
            dataIndex: 'nom',
            key:'nom',
            fixed:'left',
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
                    <a className="p-2 bg-blue-400 rounded-md text-white" onClick={()=>{navigateTo(record.key)}} >commandes</a>
                    <Button danger className="p-2  rounded-md text-white" onClick={async ()=>{ await Delete(record.key)}} ><DeleteOutlined /></Button>
                </Space>
            ),
        },
    ];

    const data: DataType[] = customers.map((item:any) => {
        return {
            key: item.id,
            nom: item.nom,
            prenoms: item.prenoms,
            adresse: item.adresse,
            country: item.country,
            telephone:item.telephone ,
            // Ajoutez ici d'autres propriétés si nécessaire
        };
    });
    return (
        <div >
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
                style={{ top: 100 , right: 40 }}
                icon={<UserAddOutlined />}
            />
        </div>
    );
}

export default Page;
