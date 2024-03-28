import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";

import { useState } from "react";

const API_WEATHER = `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_API_KEY}&q=`;

function App() {
	const [city, setCity] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState({
		error: false,
		message: "",
	});

	const onSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (!city.trim()) throw { message: "City field is required" };

			const response = await fetch(`${API_WEATHER}${city}`);

			const data = await response.json();

			if (data.error) throw { message: data.error.message };

			setWeather({
				city: data.location.name,
				country: data.location.country,
				temp: data.current.temp_c,
				condition: data.current.condition.code,
				icon: data.current.condition.icon,
				condition_text: data.current.condition.text,
			});
		} catch (e) {
			setError({
				error: true,
				message: e.message,
			});
		} finally {
			setLoading(false);
			console.clear();
		}
	};

	const [weather, setWeather] = useState(false);

	const theme = createTheme({
		palette: {
			secondary: {
				main: "#f06292",
			},
		},
	});

	return (
		<>
			<Container
				maxWidth="xs"
				sx={{ display: "flex", flexDirection: "column", height: "100vh", justifyContent: "space-between", py: 5 }}>
				<Box>
					<Typography variant="h4" component="h1" gutterBottom align="center">
						Weather app
					</Typography>
					<Box sx={{ display: "grid", gap: 2 }} component="form" autoComplete="off" onSubmit={onSubmit}>
						<ThemeProvider theme={theme}>
							<TextField
								label="Example: city, province, country"
								id="city"
								variant="filled"
								size="small"
								fullWidth
								required
								value={city}
								onChange={(e) => {
									setCity(e.target.value);
									setWeather(false);
									setError({ error: false, message: "" });
								}}
								error={error.error}
								helperText={error.message}
								color="secondary"
							/>
						</ThemeProvider>
						<LoadingButton
							variant="contained"
							type="submit"
							loading={loading}
							loadingIndicator="Loading..."
							sx={{ backgroundColor: "#f06292", ":hover": { backgroundColor: "#f085a3" } }}>
							Buscar
						</LoadingButton>
					</Box>

					{loading && <Typography align="center">Loading...</Typography>}
					{weather && (
						<Box sx={{ mt: 2, display: "grid", gap: 2, textAlign: "center" }}>
							<Typography variant="h4" component="h2">
								{weather.city}, {weather.country}
							</Typography>
							<Box component="img" alt={weather.condition_text} src={weather.icon} sx={{ margin: "0 auto" }} />
							<Typography variant="h5" component="h3">
								{weather.temp} °C
							</Typography>
							<Typography variant="h6" component="h4">
								{weather.condition_text}
							</Typography>
						</Box>
					)}
				</Box>

				<Typography textAlign="center" sx={{ mt: 2, fontSize: "10px" }}>
					Powered by: &nbsp;
					<Typography href="https://www.weatherapi.com/" title="Weather API" component="a" variant="p" sx={{ color: "#f06292" }}>
						WeatherAPI.com
					</Typography>
				</Typography>
			</Container>
		</>
	);
}

export default App;
