import React from 'react';
import { IndeterminateBar, Panel } from '@epam/promo';
import * as css from './BasicExample.scss';

export default function CustomLabelProgressBarExample() {

    return (
        <Panel style={ { flexBasis: '100%' } } cx={ css.root }>
            <IndeterminateBar />
            <IndeterminateBar size='18' />
            <IndeterminateBar size='24' />
        </Panel>
    );
}