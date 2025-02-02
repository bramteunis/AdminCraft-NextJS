import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ApexOptions } from 'apexcharts';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from 'lodash';
import ExpensesDataType from './types/ExpensesDataType';
import { useGetProjectDashboardWidgetsQuery } from '../../../ProjectDashboardApi';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

/**
 * The MonthlyExpensesWidget widget.
 */
function WeeklyExpensesWidget() {
	const { data: widgets, isLoading } = useGetProjectDashboardWidgetsQuery();
	const widget = widgets?.weeklyExpenses as ExpensesDataType;
	const { amount, series, labels } = widget;
	const theme = useTheme();

	const chartOptions: ApexOptions = {
		chart: {
			animations: {
				enabled: false
			},
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'line',
			sparkline: {
				enabled: true
			}
		},
		colors: [theme.palette.secondary.main],
		stroke: {
			curve: 'smooth'
		},
		tooltip: {
			theme: 'dark'
		},
		xaxis: {
			type: 'category',
			categories: labels
		},
		yaxis: {
			show: false,
			labels: {
				formatter: (val) => `$${val}`
			}
		}
	};

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widget) {
		return null;
	}

	return (
		<Paper className="flex flex-col flex-auto shadow-sm rounded-xl overflow-hidden">
			<div className="flex items-center justify-between pt-2 px-2">
				<div className="px-2 text-lg font-medium tracking-tight leading-6 truncate">Weekly Expenses</div>
				<div className="">
					<IconButton>
						<FuseSvgIcon size={20}>heroicons-solid:ellipsis-vertical</FuseSvgIcon>
					</IconButton>
				</div>
			</div>
			<div className="flex items-center p-4">
				<div className="flex flex-col">
					<div className="text-3xl font-semibold tracking-tight leading-[1.25]">
						{amount.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						})}
					</div>
					<div className="flex items-center">
						<FuseSvgIcon
							className="mr-1 text-green-500"
							size={20}
						>
							heroicons-solid:trending-down
						</FuseSvgIcon>
						<Typography className="font-medium text-sm text-secondary leading-none whitespace-nowrap">
							<span className="text-green-500">2%</span>
							<span> below projected</span>
						</Typography>
					</div>
				</div>
				<div className="flex flex-col flex-auto ml-8 min-w-0">
					<ReactApexChart
						className="w-full h-16"
						options={chartOptions}
						series={_.cloneDeep(series)}
						type={chartOptions?.chart?.type}
						height={chartOptions?.chart?.height}
					/>
				</div>
			</div>
		</Paper>
	);
}

export default WeeklyExpensesWidget;
