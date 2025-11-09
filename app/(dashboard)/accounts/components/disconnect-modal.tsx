interface DisconnectModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export function DisconnectModal({ onConfirm, onCancel }: DisconnectModalProps) {
    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-xl mb-2">Disconnect Account?</h3>
                <p className="text-base-content/70 mb-4">
                    Are you sure you want to disconnect this social media account?
                </p>

                <div className="alert alert-warning mb-6">
                    <i className="fa-solid fa-duotone fa-triangle-exclamation"></i>
                    <div>
                        <p className="font-semibold">Warning</p>
                        <p className="text-sm">
                            Any scheduled posts for this account will need to be rescheduled or canceled.
                        </p>
                    </div>
                </div>

                <div className="modal-action">
                    <button
                        className="btn btn-ghost"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-error"
                        onClick={onConfirm}
                    >
                        <i className="fa-solid fa-duotone fa-link-slash"></i>
                        Disconnect
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onCancel}></div>
        </div>
    );
}
