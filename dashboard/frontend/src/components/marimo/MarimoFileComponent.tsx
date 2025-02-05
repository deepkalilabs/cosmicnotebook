import { MarimoFile } from '@/app/types';
// import { getSessionId } from '@/lib/marimo/sessions';
import { asURL } from '@/lib/marimo/urls';
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export type TypedString<T> = string & { __type__: T };
export type SessionId = TypedString<"SessionId">;
export interface MarimoFileComponentProps {
    file: MarimoFile;
    returnUrl: string;
    user_id?: string;
    notebook_id?: string;
}


export function isSessionId(value: string | null): value is SessionId {
    if (!value) {
      return false;
    }
    return /^s_[\da-z]{6}$/.test(value);
}

/**
 * Resolve the path to a URL.
 *
 * If its a relative path, it will be resolved to the current origin.
 *
 * If document.baseURI is set, it will be used as the base URL.
 */
  
// function tabTarget(path: string) {
//     // Consistent tab target so we open in the same tab when clicking on the same notebook
//     return `${getSessionId()}-${encodeURIComponent(path)}`;
// } 
  
  
export default function MarimoFileComponent(props: MarimoFileComponentProps) {
    const { file, returnUrl, user_id, notebook_id } = props;
    // If path is a sessionId, then it has not been saved yet
    // We want to keep the sessionId in this case
    debugger
    const isNewNotebook = isSessionId(file.path);

    if (!user_id) {
      throw new Error("User should not be null for creating notebook.");
    }
    if (!notebook_id) {
      throw new Error("Notebook should not be null for creating notebook.");
    }

    const href = isNewNotebook
      ? asURL(file.initializationId || '', user_id, notebook_id)
      : asURL(file.path, user_id, notebook_id);
  
    const router = useRouter(); 

    return (
        <Button 
            variant="default"
            className="w-full"
            onClick={() => {
                sessionStorage.setItem('returnUrl', returnUrl);
                router.push(href.toString());
            }}>
        Open Notebook
    </Button>
    );
}

    // useEffect(() => {
    //     sessionStorage.setItem('returnUrl', returnUrl);
    //     router.push(href.toString());
    // }, []);

    // return null;
    // return (
    //   <a
    //     className="py-1.5 px-4 hover:bg-[var(--blue-2)] hover:text-primary transition-all duration-300 cursor-pointer group relative flex gap-4 items-center"
    //     key={file.path}
    //     href={href.toString()}
    //     target={tabTarget(file.initializationId || file.path)}
    //   >
    //     <div className="flex flex-col justify-between flex-1">
    //       <span className="flex items-center gap-2">
    //         {file.name}
    //         {isMarkdown && (
    //           <span className="opacity-80">
    //             <FileTextIcon />
    //           </span>
    //         )}
    //       </span>
    //       <p
    //         title={file.path}
    //         className="text-sm text-muted-foreground overflow-hidden whitespace-nowrap overflow-ellipsis"
    //       >
    //         {file.path}
    //       </p>
    //     </div>
    //     {/* <div className="flex flex-col gap-1 items-end"> */}
    //       {/* <div className="flex gap-3 items-center">
    //         <div>
    //           <SessionShutdownButton filePath={file.path} />
    //         </div>
    //         <ExternalLinkIcon
    //           size={20}
    //           className="group-hover:opacity-100 opacity-0 transition-all duration-300 text-primary"
    //         />
    //       </div> */}
    //       {/* {!!file.lastModified && (
    //         <div className="text-xs text-muted-foreground opacity-80">
    //           {timeAgo(file.lastModified * 1000)}
    //         </div>
    //       )} */}
    //     {/* </div> */}
    //   </a>
    // );
//   };
  