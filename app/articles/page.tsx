"use client"

import React, {FC, useEffect, useState} from 'react';
import {supabase} from "@/utils/supabase/client";
import {Carousel, GetProp, Image, UploadFile, UploadProps} from 'antd';


const ArticlePage = (props: any) => {
    const [items, setItems] = useState<any[]>([]);
    const [reload, setReload] = useState(false);
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const {data, error} = await supabase
                    .from('articles')
                    .select('nom_article ,prix_article , prix_article, country , destinataire, commentaire ,numero_destinataire , imageUrl')
                    .eq('commande_id', props.idArticle);
                if (error) {
                    console.error(error);
                } else {
                    setItems(data);
                }
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };
        fetchItems();
    }, [reload]);
    const contentStyle: React.CSSProperties = {
        margin: 0,
        height: 'auto',
        color: '#fff',
        lineHeight: '50px',
        textAlign: 'center',
        background: '#364d79',
    };
    const imgStyle: React.CSSProperties = {
        padding:0,
        height: 'auto',
        width: '100%',
        textAlign: 'center',
        background: '#364d79',
    };

    return (
        <div>
            <Carousel arrows infinite={false}>
                {
                    items.map((item , index) => (
                        <div key={index} className="py-2 flex flex-row">

                            <h3 style={contentStyle}>Article : {item.nom_article}</h3>
                            <h3 style={contentStyle}> Prix : {item.prix_article}</h3>
                            <h3 style={contentStyle}>Destinataire : {item.destinataire}</h3>
                            <h3 style={contentStyle}>Telephone : {item.numero_destinataire}</h3>
                            <h3 style={contentStyle}>Pays de destination : {item.country}</h3>
                            <h3 style={contentStyle}> Commentaire : {item.commentaire}</h3>

                            <Image style={imgStyle} src={item.imageUrl} alt=""/>
                        </div>

                    ))
                }

            </Carousel>
            <div>

            </div>
            <br/>
        </div>
    );
}

export default ArticlePage;
