import { useWorkspace } from "../../../../context/workspace-context";
import ToolDropdown from "../dropdown";
import ToolDropdownItem from "../item/item";

type Props = {
    close: () => void;
};

export default function FileDropDown({ close }: Props) {
    const { openWorkspace } = useWorkspace();
    
    const handle = (name: string) => {
        console.log(name);
        close();
    };

    return (
        <ToolDropdown close={close}>
            <ToolDropdownItem
                label="New File"
                onSelect={() => handle("new file")}
            />
            <ToolDropdownItem
                label="Open File"
                onSelect={() => handle("open file")}
            />
            <ToolDropdownItem
                label="Open Folder"
                onSelect={
                    () => {
                        handle("open folder");
                        openWorkspace();
                    }
                }
            />
        </ToolDropdown>
    );
}
