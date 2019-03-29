import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const styles = StyleSheet.create({
	buttonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		marginLeft: PixelRatio.roundToNearestPixel(8),
	},
	parentContainer: {
		alignItems: 'flex-end',
	},
	textContainer: {
		paddingVertical: PixelRatio.roundToNearestPixel(4),
		paddingHorizontal: PixelRatio.roundToNearestPixel(8),
		borderRadius: PixelRatio.roundToNearestPixel(4),
		borderWidth: StyleSheet.hairlineWidth,
		backgroundColor: 'white',
	},
	viewContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
})

export default class ActionButtonItem extends PureComponent {
	static get defaultProps() {
		return {
			active: true,
			buttonColor: '#000',
			children: null,
			height: PixelRatio.roundToNearestPixel(37),
			offsetX: PixelRatio.roundToNearestPixel(30),
			onPress: () => {},
			title: '',
			width: PixelRatio.roundToNearestPixel(56),
		}
	}

	static get propTypes() {
		return {
			active: PropTypes.bool,
			buttonColor: PropTypes.string,
			children: PropTypes.arrayOf(PropTypes.element),
			height: PropTypes.number,
			offsetX: PropTypes.number,
			onPress: PropTypes.func,
			title: PropTypes.string,
			width: PropTypes.number,
		}
	}

	render() {
		const { active, buttonColor, children, width, height, offsetX, onPress, title } = this.props

		if (!active) return null

		const buttonStyle = {
			width: width,
			height: height,
			backgroundColor: buttonColor,
			borderRadius: PixelRatio.roundToNearestPixel(height / 2),
		}

		const textStyle = {
			borderColor: buttonColor,
		}

		const parentStyle = {
			paddingHorizontal: PixelRatio.roundToNearestPixel(offsetX),
			height: PixelRatio.roundToNearestPixel(height + 8),
		}

		return (
			<View pointerEvents={'box-none'} style={[styles.parentContainer, parentStyle]}>
				<TouchableOpacity activeOpacity={0.9} onPress={onPress}>
					<View style={styles.viewContainer}>
						<View style={[styles.textContainer, textStyle]}>
							<Text>{title}</Text>
						</View>

						<View style={[styles.buttonContainer, buttonStyle]}>{children}</View>
					</View>
				</TouchableOpacity>
			</View>
		)
	}
}
