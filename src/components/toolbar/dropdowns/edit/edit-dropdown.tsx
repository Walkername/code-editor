import ToolDropdown from "../dropdown";
import ToolDropdownItem from "../item/item";

type Props = {
    close: () => void;
};

export default function EditDropDown({ close }: Props) {
    const handle = (name: string) => {
        console.log(name);
        close();
    };

    return (
        <ToolDropdown close={close}>
            <ToolDropdownItem
                label="Undo"
                onSelect={() => handle("undo")}
            />
            <ToolDropdownItem
                label="Redo"
                onSelect={() => handle("redo")}
            />
            <ToolDropdownItem
                label="Cut"
                onSelect={() => handle("cut")}
            />
            <ToolDropdownItem
                label="Copy"
                onSelect={() => handle("copy")}
            />
            <ToolDropdownItem
                label="Paste"
                onSelect={() => handle("paste")}
            />
        </ToolDropdown>
    );
}
