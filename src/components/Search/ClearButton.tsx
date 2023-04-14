import { FC } from 'react';
import { FaXing } from 'react-icons/fa';

// icons


interface ClearButtonProps {
    active: boolean;
    isFocus?: boolean;
    separator?: boolean;
    onClick: () => void;
}

const defaultProps = {
    isFocus: true,
    separator: false,
};

const ClearButtonProps: FC<ClearButtonProps> = ({ onClick, active, isFocus, separator }) => {
    return (
        <div className={`${separator && 'border-r border-gray-200'} flex items-center h-8`}>
            <div
                role="button"
                tabIndex={0}
                className={`${active && isFocus ? 'opacity-100' : 'opacity-0'} flex items-center pr-3`}
                onClick={onClick}
            >
                <FaXing className="h-6 p-1 bg-gray-200 rounded-full bg-opacity-60 hover:bg-opacity-100" />
            </div>
        </div>
    );
};

ClearButtonProps.defaultProps = defaultProps;

export default ClearButtonProps;
