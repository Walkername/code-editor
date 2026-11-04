type Props = {
    label: string;
    onSelect: () => void;
};

export default function ToolDropdownItem({ label, onSelect }: Props) {
    return (
        <li>
            <button onClick={onSelect}>{label}</button>
        </li>
    );
}
