import React from 'react';
import { render } from "react-dom";
import { FlexRow, skinContext as promoSkinContext } from "@epam/promo";
import { ContextProvider, UuiContexts } from "@epam/uui";
import "@epam/uui-components/styles.css";
import "@epam/promo/styles.css";
import Example from "./Example";
import { svc, getApi } from './api';

type TApi = ReturnType<typeof getApi>;

const rootElement = document.getElementById("root");

render(
    <ContextProvider<TApi, UuiContexts>
        apiDefinition={getApi}
        onInitCompleted={(context) => Object.assign(svc, context)}
        skinContext={promoSkinContext}
    >
        <FlexRow alignItems='stretch'>
            <Example />
        </FlexRow>
    </ContextProvider>,
    rootElement
);