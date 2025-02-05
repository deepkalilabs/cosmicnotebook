// app/types.ts
export type CellType = 'code' | 'markdown' | 'file' | 'connector';

export interface NotebookCell {
  id: string;
  code: string;
  output: string;
  executionCount: number;
  type: CellType;
}

export interface NotebookToolbarProps {
  name: string;
  onHandleAddCell: (type: CellType) => void;
  onHandleSave: (filename: string) => Promise<void>;
  onHandleLoad: (filename: string) => Promise<void>;
  onHandleRestartKernel?: () => Promise<void>;
  isConnected: boolean;
  allCells: NotebookCell[];
  onHandleDeploy?: () => Promise<void>;
  onHandleCreateConnector: (type: string, values: Record<string, string | number | boolean>, userId: string, notebookId: string) => void;
}

export interface NotebookStore {
  cells: NotebookCell[];
  maxExecutionCount: number;
  addCell: (type: CellType, id?: string) => void;
  updateCellCode: (id: string, code: string) => void;
  updateCellType: (id: string, type: CellType) => void;
  updateCellOutput: (id: string, output: string) => void;
  deleteCell: (id: string) => void;
  moveCellUp: (id: string) => void;
  moveCellDown: (id: string) => void;
  setCells: (cells: NotebookCell[]) => void;
}

export interface MarkdownEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  isMarkdownEditing: boolean;
}

export interface NotebookCellProps {
  id: string;
  code?: string;
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  output: string;
  executionCount: number;
  isExecuting: boolean;
  type: CellType;
  onCodeChange: (code: string) => void;
  onTypeChange: (type: CellType) => void;
  onExecute: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}


export interface ConnectorsButtonProps {
  onHandleCreateConnector: (connector: string,  values:Record<string, string | number | boolean>, userId: string, notebookId: string) => Promise<ConnectorResponse>;
}

export interface IntegrationsButtonProps {
  onHandleCreateIntegration: (integration: string,  values:Record<string, string | number | boolean>, userId: string, notebookId: string) => Promise<ConnectorResponse>;
}

export interface ConnectorCredentials {
  id: string;
  connector_id: string;
  user_id: string;
  notebook_id: string;
  connector_type: string;
  credentials: JSON;
  has_seen_doc?: boolean;
  code_string: string;
  doc_string: string;
  //status?: 'connected' | 'disconnected' | 'pending' | 'error';
  //created_at?: string;
  //updated_at?: string;
}


export interface NotebookConnectionProps {
  onNotebookDeployed?: (data: OutputDeployMessage) => void;
  notebookDetails?: NotebookDetails;
}

export interface NotebookDetails {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  s3_url?: string;
  submit_endpoint?: string;
  cells?: NotebookCell[];
  session_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NotebookDetailStore {
  notebookDetails: NotebookDetails | null;
  setNotebookDetails: (notebookDetails: NotebookDetails | null) => void;
}

export interface WebSocketMessage {
  type: string;
  code?: string;
  cellId?: string;
  output?: string;
}

export interface SaveNotebookRequest {
  filename: string;
  notebook: {
    cells: NotebookCell[];
  };
}

export interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
  notebook?: {
    cells: NotebookCell[];
  };
}

export interface OutputExecutionMessage {
    type: string;
    cellId: string;
    output: string;
}

export interface OutputSaveMessage {
    type: string;
    success: boolean;
    message: string;
}

export interface OutputLoadMessage {
    type: string;
    success: boolean;
    message: string;
    cells: NotebookCell[];
}

export interface OutputDeployMessage {
    type: string;
    success: boolean;
    message: string;
    output: JSON;
}

export interface ConnectorResponse {
    error: string | null;
    status: number;
    data: Record<string, string | number | boolean>;
} 

export interface Job {
    completed: boolean | null;
    completed_at: string | null;
    created_at: string;
    error: string | null;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    input_params: any | null;
    notebook_id: string;
    request_id: string;
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    result: any | null;
    updated_at: string;
}

export interface Jobs {
  jobs: Job[];
}

export interface FileUploadProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileSelect: (fileName: string, content: { cells: any[] }) => void;
}

export interface OutputConnectorCreatedMessage {
    type: string;
    success: boolean;
    message: string;
    cell: NotebookCell;
    code: string;
    docstring: string;
}

export interface User {
    id: string;
    email: string;
}

export interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  created_by: string; // user uuid
}

export interface OrganizationStore {
  organization: Organization | null;
  setOrganization: (organization: Organization | null) => void;
} 

export interface OrgUser {
  org_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrgUserStore {
  orgUsers: OrgUser[];
  setOrgUsers: (orgUsers: OrgUser[]) => void;
}

export interface NotebookPageProps {
  notebookId: string;
  userId: string | null;
  name: string;
}

export interface ScheduledJob {
  id: string;
  submit_endpoint: string;
  input_params: string;
  schedule: string;
  last_run?: string;
  next_run?: string;
  status?: string;
  last_run_output?: string;
}


export interface ConnectorsStore {
  //Dialog state
  isDialogOpen: boolean;
  selectedConnector: string | null;

  //Connectors data
  connectors: ConnectorCredentials[];
  isLoading: boolean;
  error: string | null;

  //Dialog functions
  openDialog: () => void;
  closeDialog: () => void;
  setSelectedConnector: (connector: string | null) => void;
  resetDialog: () => void;

  //Connector actions
  addConnector: (connector: ConnectorCredentials) => void;
  updateConnector: (connector: ConnectorCredentials) => void;
  deleteConnector: (connector: ConnectorCredentials) => void;
  removeConnector: (connector: ConnectorCredentials) => void;
  resetConnectors: () => void;

  // Status management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utility functions
  setConnectors: (connectors: ConnectorCredentials[]) => void;
  getConnectorByType: (type: string) => ConnectorCredentials | null;
  getConnectorById: (id: string) => ConnectorCredentials | null;
  hasConnector: (type: string) => boolean; 

}

export interface ConnectorCredentialsList {
  credentials: ConnectorCredentials[];
}

export interface MarimoFile {
  id?: string;
  initializationId?: string | null;
  lastModified?: number | null;
  name: string;
  path: string;
  sessionId?: string | null;
  description?: string;
  created_at: string;
  updated_at: string;
};
