<div className='insurance-detail-two'>
    {isShowDetailInfor3 ? (
        // Hiển thị FULL danh sách khi bấm "Xem thêm"
        <>
            <div className='ins-detail-child1'><FormattedMessage id="patient.extra-infor-doctor.insurance-direct-title" /></div>
            <div className='ins-detail-child2'>
                <FormattedMessage id="patient.extra-infor-doctor.insurance-direct-desc" />
            </div>
            <div className='ins-detail-child3'>
                <div className='ins-detail-child-child'>
                    <FormattedMessage id="patient.extra-infor-doctor.insurance" />
                </div>
                <ul>
                    {Array.from({ length: 26 }, (_, i) => {
                        const index = i + 1;
                        return (
                            <li key={index}>
                                {index}.{" "}
                                <FormattedMessage id={`patient.extra-infor-doctor.insurancee.list.${index}`} />
                            </li>
                        );
                    })}
                </ul>
            </div>
            <span onClick={() => this.showHideDetailInfor3(false)}>
                <FormattedMessage id="patient.extra-infor-doctor.hide" />
            </span>
        </>
    ) : (
        // Chỉ hiển thị ngắn gọn + nút "Xem thêm"
        <>
            <div className='ins-detail-child1'><FormattedMessage id="patient.extra-infor-doctor.insurance-direct-title" /></div>
            <div className='ins-detail-child2'>
                <FormattedMessage id="patient.extra-infor-doctor.insurance-direct-desc" />
            </div>
            <span onClick={() => this.showHideDetailInfor3(true)}>
                <FormattedMessage id="patient.extra-infor-doctor.insurance-see-list" />
            </span>
        </>
    )}
</div>
