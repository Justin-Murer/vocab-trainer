import { useState } from 'react';
import {
	Box,
	Button,
	CssBaseline,
	Paper,
	Stack,
	ThemeProvider,
	Typography,
	createTheme,
} from '@mui/material';
import vocabJson from './data/vocab.json';

type VocabWord = {
	italian: string;
	english: string;
	german: string;
};

type VocabJsonEntry = {
	id: number;
	italian: {
		word: string;
	};
	english: {
		word: string;
	};
	german: {
		article: string | null;
		word: string;
	};
};

const formatGerman = (entry: VocabJsonEntry) => {
	const article = entry.german.article?.trim();
	return article ? `${article} ${entry.german.word}` : entry.german.word;
};

const vocabWords: VocabWord[] = (vocabJson as VocabJsonEntry[]).map(
	(entry) => ({
		italian: entry.italian.word,
		english: entry.english.word,
		german: formatGerman(entry),
	}),
);

const pickRandomIndex = (length: number, exclude?: number) => {
	if (length <= 1) {
		return 0;
	}

	let nextIndex = Math.floor(Math.random() * length);
	while (nextIndex === exclude) {
		nextIndex = Math.floor(Math.random() * length);
	}

	return nextIndex;
};

const theme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			main: '#b06cff',
		},
		background: {
			default: '#040206',
			paper: '#10081a',
		},
	},
	shape: {
		borderRadius: 18,
	},
	typography: {
		fontFamily: '"Inter", "Segoe UI", sans-serif',
	},
});

function App() {
	const [isFlipped, setIsFlipped] = useState(false);
	const [currentWordIndex, setCurrentWordIndex] = useState(
		pickRandomIndex(vocabWords.length),
	);

	const currentWord = vocabWords[currentWordIndex];

	const handleNextWord = () => {
		setCurrentWordIndex((previousIndex) =>
			pickRandomIndex(vocabWords.length, previousIndex),
		);
		setIsFlipped(false);
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box
				sx={{
					minHeight: '100dvh',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					px: 2,
					py: 2,
					background:
						'radial-gradient(circle at top, rgba(176, 108, 255, 0.16), transparent 48%), #040206',
				}}
			>
				<Box
					sx={{
						width: '100%',
						maxWidth: 430,
						minHeight: { xs: 'calc(100dvh - 32px)', sm: 700 },
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						gap: 3,
						mx: 'auto',
					}}
				>
					<Box sx={{ textAlign: 'center', pt: { xs: 1, sm: 2 } }}>
						<Typography
							variant="h5"
							sx={{ fontWeight: 700, letterSpacing: 0.4 }}
						>
							Italian Vocab Trainer
						</Typography>
						<Typography
							variant="body2"
							sx={{
								color: 'primary.light',
								mt: 0.75,
								opacity: 0.9,
							}}
						>
							Tap the card to reveal translations
						</Typography>
					</Box>

					<Box
						sx={{
							flexGrow: 1,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Box
							onClick={() =>
								setIsFlipped((previous) => !previous)
							}
							onKeyDown={(event) => {
								if (
									event.key === 'Enter' ||
									event.key === ' '
								) {
									event.preventDefault();
									setIsFlipped((previous) => !previous);
								}
							}}
							role="button"
							tabIndex={0}
							sx={{
								width: '100%',
								maxWidth: 360,
								height: { xs: 240, sm: 280 },
								perspective: '1200px',
								outline: 'none',
								borderRadius: 4,
								'&:focus-visible .flip-surface': {
									boxShadow: '0 0 0 2px #cf9fff',
								},
							}}
						>
							<Box
								className="flip-surface"
								sx={{
									position: 'relative',
									width: '100%',
									height: '100%',
									transformStyle: 'preserve-3d',
									transform: isFlipped
										? 'rotateY(180deg)'
										: 'rotateY(0deg)',
									transition:
										'transform 560ms cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 300ms ease',
									borderRadius: 4,
								}}
							>
								<Paper
									elevation={0}
									sx={{
										position: 'absolute',
										inset: 0,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										textAlign: 'center',
										px: 3,
										backgroundColor: 'background.paper',
										border: '1.5px solid',
										borderColor: 'primary.main',
										backfaceVisibility: 'hidden',
										boxShadow:
											'0 10px 26px rgba(0, 0, 0, 0.55), 0 0 26px rgba(176, 108, 255, 0.08)',
										borderRadius: 4,
									}}
								>
									<Typography
										variant="h3"
										sx={{
											fontWeight: 700,
											fontSize: {
												xs: '2rem',
												sm: '2.35rem',
											},
										}}
									>
										{currentWord.italian}
									</Typography>
								</Paper>

								<Paper
									elevation={0}
									sx={{
										position: 'absolute',
										inset: 0,
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
										textAlign: 'center',
										px: 3,
										gap: 1.25,
										backgroundColor: 'background.paper',
										border: '1.5px solid',
										borderColor: 'primary.main',
										backfaceVisibility: 'hidden',
										transform: 'rotateY(180deg)',
										boxShadow:
											'0 10px 26px rgba(0, 0, 0, 0.55), 0 0 26px rgba(176, 108, 255, 0.08)',
										borderRadius: 4,
									}}
								>
									<Typography
										variant="body2"
										sx={{ color: 'primary.light' }}
									>
										English
									</Typography>
									<Typography
										variant="h5"
										sx={{ fontWeight: 600, mb: 1 }}
									>
										{currentWord.english}
									</Typography>
									<Typography
										variant="body2"
										sx={{ color: 'primary.light' }}
									>
										German
									</Typography>
									<Typography
										variant="h5"
										sx={{ fontWeight: 600 }}
									>
										{currentWord.german}
									</Typography>
								</Paper>
							</Box>
						</Box>
					</Box>

					<Stack
						direction={{ xs: 'column', sm: 'row' }}
						spacing={1.75}
						sx={{ pb: { xs: 1, sm: 2 } }}
					>
						<Button
							variant="outlined"
							size="large"
							onClick={handleNextWord}
							sx={{
								flex: 1,
								py: 1.4,
								borderWidth: 1.5,
								fontWeight: 600,
								fontSize: '1rem',
								color: 'primary.light',
								borderColor: 'primary.main',
								'&:hover': {
									borderWidth: 1.5,
									borderColor: 'primary.light',
									backgroundColor:
										'rgba(176, 108, 255, 0.08)',
								},
							}}
						>
							Didn't know
						</Button>
						<Button
							variant="contained"
							size="large"
							onClick={handleNextWord}
							sx={{
								flex: 1,
								py: 1.4,
								fontWeight: 700,
								fontSize: '1rem',
								boxShadow:
									'0 6px 20px rgba(176, 108, 255, 0.28)',
								background:
									'linear-gradient(180deg, rgba(182, 122, 255, 1) 0%, rgba(143, 74, 237, 1) 100%)',
								'&:hover': {
									boxShadow:
										'0 8px 24px rgba(176, 108, 255, 0.34)',
									background:
										'linear-gradient(180deg, rgba(194, 141, 255, 1) 0%, rgba(153, 86, 244, 1) 100%)',
								},
							}}
						>
							Knew it
						</Button>
					</Stack>
				</Box>
			</Box>
		</ThemeProvider>
	);
}

export default App;
