"use client"

import React, {FC, useEffect, useState} from 'react';
import {supabase} from "@/utils/supabase/client";
import {Carousel} from 'antd';


const ArticlePage = (props:any) => {
    const [items, setItems] = useState<any[]>([]);
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const {data, error} = await supabase
                    .from('articles')
                    .select('nom_article ,prix_article , quantite')
                    .eq('commande_id',props.idArticle);
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
    }, [items]);
    const contentStyle: React.CSSProperties = {
        margin: 0,
        height: 'auto',
        color: '#fff',
        lineHeight: '50px',
        textAlign: 'center',
        background: '#364d79',
    };
    return (
        <div>
            <Carousel arrows infinite={false}>
                {
                    items.map((item) => (
                        <div className="py-2">
                            <h3 style={contentStyle}>Article : {item.nom_article}</h3>
                            <h3 style={contentStyle}> Quantité : {item.quantite}</h3>
                            <h3 style={contentStyle}> Prix : {item.prix_article}</h3>
                        </div>

                    ))
                }

            </Carousel>
            <br/>
        </div>
    );
}

export default ArticlePage;
