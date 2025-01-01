"use client";

import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';


import { Heading, Text, Flex, Button, Grid, Icon, InlineCode, Logo, LetterFx, Arrow, GlitchFx } from '@/once-ui/components';
import Link from 'next/link';

// Define the type for a resolution
type Resolution = {
	resolution_id: string;
	timestamp: string;
	action: string;
};

export default function Home() {
	const [timer, setTimer] = useState('[FETCHING DATA]');
	const [totalSupply, setTotalSupply] = useState('[FETCHING DATA]');
	const [historicResolutions, setHistoricResolutions] = useState<Resolution[]>([]);


	const resolutionsEndRef = useRef<HTMLDivElement | null>(null);
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		const socket = io('http://localhost:4000');
		socketRef.current = socket;

		socket.on('time', (time) => {
			setTimer(time);
		});

		socket.on('supply', (supply) => {
			setTotalSupply(supply);
		});

		socket.on('historicResolutions', (resolutions) => {
			setHistoricResolutions(resolutions);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (resolutionsEndRef.current) {
			resolutionsEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [historicResolutions]);

	const handleButtonClick = (buttonId: string) => {
		if (socketRef.current) {
			socketRef.current.emit('buttonClick', buttonId);
		}
	};

	return (
		<Flex
			fillWidth paddingTop="l" paddingX="l"
			direction="column" alignItems="center" flex={1}>
			<Flex
				position="relative"
				as="section" overflow="hidden"
				fillWidth minHeight="0" maxWidth={68}
				direction="column" alignItems="center" flex={1}>
				
				<Flex justifyContent="flex-end" alignItems="center" fillWidth paddingX="l" paddingY="s">
					<Button 
						size="m" 
						variant="secondary" 
						style={{ 
							padding: 'var(--static-space-4) var(--static-space-8)', 
							boxSizing: 'border-box' 
						}}
					>
						Connect
					</Button>
				</Flex>

				<Flex
					as="main"
					direction="column" justifyContent="center"
					fillWidth fillHeight padding="l" gap="l">
					<Flex
						mobileDirection="column"
						fillWidth gap="24">

						<Flex
							position="relative"
							flex={4} gap="24" marginBottom="m"
							direction="column">
							<Flex
								justifyContent="center"
								alignItems="center"
								gap="24">
								<InlineCode
									className="shadow-m"
									style={{
										width: 400,
										padding: 'var(--static-space-8) var(--static-space-16)',
										backdropFilter: 'blur(var(--static-space-1))'}}>
									<div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
										{timer}
									</div>
								</InlineCode>
								<InlineCode
									className="shadow-m"
									style={{
										width: 400,
										padding: 'var(--static-space-8) var(--static-space-16)',
										backdropFilter: 'blur(var(--static-space-1))'}}>
									<div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
										{totalSupply}
									</div>
								</InlineCode>
							</Flex>
							<Flex justifyContent="center" alignItems="center">
								<Heading
									wrap="balance"
									variant="display-strong-s">
									<span className="font-code">
										<GlitchFx
											trigger="instant"
											speed="medium"
											>
											choose wisely.
										</GlitchFx>
									</span>
								</Heading>
							</Flex>
							<Flex justifyContent="center" alignItems="center" gap="12" marginTop="xl">
								<Button 
									size="m" 
									variant="primary" 
									style={{ 
										width: '200px', 
										height: '50px', 
										padding: 'var(--static-space-4) var(--static-space-8)', 
										boxSizing: 'border-box' 
									}}
									onClick={() => handleButtonClick('decreaseBurn')}
								>
									Decrease Burn
								</Button>
								<Button 
									size="m" 
									variant="primary" 
									style={{ 
										width: '200px', 
										height: '50px', 
										padding: 'var(--static-space-4) var(--static-space-8)', 
										boxSizing: 'border-box' 
									}}
									onClick={() => handleButtonClick('increaseBurn')}
								>
									Increase Burn
								</Button>
								<Button 
									size="m" 
									variant="primary" 
									style={{ 
										width: '200px', 
										height: '50px', 
										padding: 'var(--static-space-4) var(--static-space-8)', 
										boxSizing: 'border-box' 
									}}
									onClick={() => handleButtonClick('decreaseMint')}
								>
									Decrease Mint
								</Button>
								<Button 
									size="m" 
									variant="primary" 
									style={{ 
										width: '200px', 
										height: '50px', 
										padding: 'var(--static-space-4) var(--static-space-8)', 
										boxSizing: 'border-box' 
									}}
									onClick={() => handleButtonClick('increaseMint')}
								>
									Increase Mint
								</Button>
							</Flex>
							<Flex justifyContent="center" alignItems="center">
								<Button 
									size="m" 
									variant="secondary" 
									style={{ 
										width: '450px', 
										height: '50px', 
										padding: 'var(--static-space-4) var(--static-space-8)', 
										boxSizing: 'border-box' 
									}}
									onClick={() => handleButtonClick('pauseSystem')}
								>
									Pause System
								</Button>
							</Flex>
						</Flex>
					</Flex>
					<Flex
						direction="column"
						alignItems="center"
						fillWidth>
						<Flex
							radius="l"
							border="neutral-medium"
							borderStyle="solid-1"
							direction="column"
							fillWidth
							paddingY="m"
							style={{
								backgroundColor: 'black',
								color: 'gray',
								fontFamily: 'monospace',
								overflowY: 'auto',
								maxHeight: '250px',
								marginBottom: '0px'
							}}>
							{historicResolutions.map((resolution, index) => (
								<div key={index} style={{ padding: '2px', marginBottom: '2px', display: 'block' }}>
									<span>Resolution {resolution.resolution_id} @ {resolution.timestamp}: {resolution.action}</span>
								</div>
							))}
							<div ref={resolutionsEndRef} />
						</Flex>
					</Flex>
				</Flex>
			</Flex>
			<Flex
				as="footer"
				position="relative"
				fillWidth paddingX="l" paddingY="m"
				justifyContent="space-between">

				<Flex
					gap="12">
					<Button
						href="temp_value"
						prefixIcon="github" size="s" variant="tertiary">
						GitHub
					</Button>
					<Button
						href="temp_value"
						prefixIcon="discord" size="s" variant="tertiary">
						Discord
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
}
