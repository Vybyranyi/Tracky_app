import React from 'react';
import { Helmet } from 'react-helmet';
import icon from '../../assets/images/icon.svg';

export default function HelmetComponent({ title = 'Tracky' }) {
    return (
        <Helmet>
            <title>{title}</title>
            <link rel="icon" type="image/svg+xml" href={icon} />
        </Helmet>
    )
}