import React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Link from 'components/common/Link';
import OverflowText from 'components/common/OverflowText';
import PageHeader from 'components/layout/PageHeader';
import RefreshButton from 'components/common/RefreshButton';
import ButtonLayout from 'components/layout/ButtonLayout';
import Favicon from 'components/common/Favicon';
import ActiveUsers from './ActiveUsers';
import Arrow from 'assets/arrow-right.svg';
import styles from './WebsiteHeader.module.css';
import useFetch from 'hooks/useFetch';
import Button from 'components/common/Button';
import { getItem } from '../../lib/web';
import { AUTH_TOKEN } from '../../lib/constants';

export default function WebsiteHeader({ websiteId, title, domain, showLink = false }) {
  const { data } = useFetch(`/website/${websiteId}/events`, {
    params: {
      token: getItem(AUTH_TOKEN),
      download: true,
    },
  });

  function downloadAsCSV() {
    let csv = objectToCSV(data);

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const ExportToCsvButton = document.createElement('a');
    ExportToCsvButton.setAttribute('hidden', '');
    ExportToCsvButton.setAttribute('href', url);
    ExportToCsvButton.setAttribute('download', 'analytics.csv');

    document.body.appendChild(ExportToCsvButton);
    ExportToCsvButton.click();
    document.body.removeChild(ExportToCsvButton);
  }

  const header = showLink ? (
    <>
      <Favicon domain={domain} />
      <Link
        className={styles.titleLink}
        href="/website/[...id]"
        as={`/website/${websiteId}/${title}`}
      >
        <OverflowText tooltipId={`${websiteId}-title`}>{title}</OverflowText>
      </Link>
    </>
  ) : (
    <>
      <Favicon domain={domain} />
      <OverflowText tooltipId={`${websiteId}-title`}>{title}</OverflowText>
    </>
  );

  return (
    <PageHeader className="row">
      <div className={classNames(styles.title, 'col-10 col-lg-4 order-1 order-lg-1')}>{header}</div>
      <div className={classNames(styles.active, 'col-12 col-lg-4 order-3 order-lg-2')}>
        <ActiveUsers websiteId={websiteId} />
      </div>
      <ButtonLayout align="center">
        <Button className={styles.button} type={'button'} onClick={downloadAsCSV}>
          Export data to CSV
        </Button>
      </ButtonLayout>
      <div className="col-2 col-lg-4 order-2 order-lg-3">
        <ButtonLayout align="right">
          <RefreshButton websiteId={websiteId} />
          {showLink && (
            <Link
              href="/website/[...id]"
              as={`/website/${websiteId}/${title}`}
              className={styles.link}
              icon={<Arrow />}
              size="small"
              iconRight
            >
              <FormattedMessage id="label.view-details" defaultMessage="View details" />
            </Link>
          )}
        </ButtonLayout>
      </div>
    </PageHeader>
  );
}

function objectToCSV(data) {
  const csvRows = [];

  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
}
