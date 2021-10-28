import * as React from 'react';
import { Icon, uuiMod, uuiElement, uuiMarkers, CX, TextInputCoreProps, UuiContexts, UuiContext, cx } from '@epam/uui';
import { IconContainer } from '../layout';
import * as css from './TextInput.scss';


const ENTER = 'Enter';
const ESCAPE = 'Escape';

export type IRenderInputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export interface TextInputProps extends TextInputCoreProps {
    acceptIcon?: Icon;
    cancelIcon?: Icon;
    dropdownIcon?: Icon;
    inputCx?: CX;
    renderInput?: (props: IRenderInputProps) => JSX.Element;
}

interface TextInputState {
    inFocus?: boolean;
}

export class TextInput extends React.Component<TextInputProps, TextInputState> {
    static contextType = UuiContext;
    context: UuiContexts;

    state = {
        inFocus: false,
    };

    inputElement: HTMLInputElement | null = null;
    inputContainer: HTMLDivElement | null = null;

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onValueChange(e.target.value);

        if (this.props.getValueChangeAnalyticsEvent) {
            const event = this.props.getValueChangeAnalyticsEvent(e.target.value, this.props.value);
            this.context.uuiAnalytics.sendEvent(event);
        }
    }

    handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        this.props.onKeyDown && this.props.onKeyDown(e);
        if (e.key === ENTER) {
            this.props.onAccept && this.props.onAccept();
        } else if (e.key === ESCAPE) {
            this.props.onCancel && this.props.onCancel();
        }
    }

    handleFocus = () => {
        this.setState({inFocus: true});
        this.props.onFocus && this.props.onFocus();
    }

    handleBlur = (e: React.SyntheticEvent<HTMLElement>) => {
        this.props.onBlur && !this.props.isReadonly && this.props.onBlur(e);
        this.setState({inFocus: false});
    }

    public focus() {
        this.inputElement && this.inputElement.focus();
    }

    handleClick = (e: any) => {
        if (e.target.classList.contains(uuiMarkers.clickable)) {
            return e.preventDefault();
        }
        this.props.onClick && this.props.onClick(e);
    }

    handleCancel = () => {
        this.props.onCancel();
        this.focus();
    }

    private getInputProps = () => {
        return {
            type: this.props.type || "text",
            className: cx(uuiElement.input, this.props.inputCx),
            disabled: this.props.isDisabled,
            placeholder: this.props.placeholder,
            value: this.props.value || '',
            readOnly: this.props.isReadonly,
            onKeyDown: this.handleKeyDown,
            onChange: this.handleChange,
            autoFocus: this.props.autoFocus,
            ref: (ref: HTMLInputElement | null) => this.inputElement = ref,
            autoComplete: this.props.autoComplete,
            name: this.props.name,
            maxLength: this.props.maxLength,
            inputMode: this.props.inputMode,
            tabIndex: this.props.tabIndex,
            id: this.props.id,
            required: this.props.isRequired,
            'aria-invalid': this.props.isInvalid,
            'aria-required': this.props.isRequired,
            'aria-disabled': this.props.isDisabled,
            'aria-readonly': this.props.isReadonly
        };
    }

    render() {
        let icon = this.props.icon && <IconContainer icon={ this.props.icon } onClick={ this.props.onIconClick }/>;

        return (
            <div onClick={ this.props.onClick && this.handleClick } ref={ el => {
                this.inputContainer = el;
            } } className={
                cx(
                    css.container,
                    uuiElement.inputBox,
                    this.props.isDisabled && uuiMod.disabled,
                    this.props.isReadonly && uuiMod.readonly,
                    this.props.isInvalid && uuiMod.invalid,
                    (!this.props.isReadonly && !this.props.isDisabled) && uuiMarkers.clickable,
                    (!this.props.isReadonly && this.state.inFocus) && uuiMod.focus,
                    this.props.cx,
                ) }
                onFocus={ this.handleFocus }
                onBlur={ this.handleBlur }
                tabIndex={ -1 }
                { ...this.props.rawProps }
            >
                { this.props.iconPosition !== 'right' && icon }
                { this.props.renderInput ? this.props.renderInput(this.getInputProps()) : <input { ...this.getInputProps() }/> }
                { this.props.onAccept && <IconContainer
                    cx={ cx('uui-icon-accept', (this.props.isReadonly || this.props.isDisabled) && css.hidden) }
                    isDisabled={ this.props.isDisabled || !this.props.value }
                    icon={ this.props.acceptIcon }
                    onClick={ this.props.value ? this.props.onAccept : undefined }
                /> }
                { this.props.onCancel && <IconContainer
                    cx={ cx('uui-icon-cancel', uuiMarkers.clickable, (this.props.isReadonly || this.props.isDisabled) && css.hidden) }
                    isDisabled={ this.props.isDisabled }
                    icon={ this.props.cancelIcon }
                    onClick={ this.handleCancel }
                /> }
                { this.props.iconPosition === 'right' && icon }
                { this.props.isDropdown && <IconContainer
                    cx={ cx((this.props.isReadonly || this.props.isDisabled) && css.hidden, uuiMarkers.clickable) }
                    icon={ this.props.dropdownIcon }
                    flipY={ this.props.isOpen }
                /> }
            </div>
        );
    }
}