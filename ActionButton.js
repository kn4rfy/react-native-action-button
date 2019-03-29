import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { PixelRatio, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ActionButtonItem from './ActionButtonItem'

const styles = StyleSheet.create({
	overlay: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		top: 0,
		backgroundColor: 'transparent',
	},
	btnText: {
		color: 'white',
		marginTop: -4,
		fontSize: 24,
		backgroundColor: 'transparent',
	},
})

export default class ActionButton extends Component {
	constructor(props) {
		super(props)

		this.state = {
			resetToken: props.resetToken,
			active: props.active,
		}

		this.timeout = null
	}

	componentDidMount() {
		this.mounted = true
	}

	componentWillReceiveProps(nextProps) {
		const { active, resetToken } = this.state

		if (nextProps.resetToken !== resetToken) {
			if (nextProps.active === false && active === true) {
				this.setState({ active: false, resetToken: nextProps.resetToken })
				return
			}

			if (nextProps.active === true && active === false) {
				this.setState({ active: true, resetToken: nextProps.resetToken })
				return
			}

			this.setState({
				resetToken: nextProps.resetToken,
				active: nextProps.active,
			})
		}
	}

	componentWillUnmount() {
		this.mounted = false
		clearTimeout(this.timeout)
	}

	//////////////////////
	// STYLESHEET GETTERS
	//////////////////////

	getOverlayStyles() {
		const { verticalOrientation } = this.props

		return [
			styles.overlay,
			{
				justifyContent: verticalOrientation === 'up' ? 'flex-end' : 'flex-start',
			},
		]
	}

	//////////////////////
	// Action Methods
	//////////////////////

	open() {
		const { active, resetToken } = this.state
		if (active) return this.reset()

		this.setState({ active: true, resetToken: resetToken })
	}

	reset() {
		const { resetToken } = this.state

		if (this.mounted) {
			this.setState({ active: false, resetToken: resetToken })
		}
	}

	//////////////////////
	// RENDER METHODS
	//////////////////////

	renderMainButton() {
		const { buttonColor, children, renderIcon, onPress, offsetX, size } = this.props

		const wrapperStyle = {
			backgroundColor: buttonColor,
			width: size,
			height: size,
			borderRadius: PixelRatio.roundToNearestPixel(size / 2),
		}

		const buttonStyle = {
			width: size,
			height: size,
			borderRadius: PixelRatio.roundToNearestPixel(size / 2),
			alignItems: 'center',
			justifyContent: 'center',
		}

		const parentStyle = { marginHorizontal: offsetX }

		return (
			<View style={[parentStyle]}>
				<TouchableOpacity
					activeOpacity={0.9}
					onPress={() => {
						onPress()
						if (children) this.open()
					}}
				>
					<View style={wrapperStyle}>
						<View style={[buttonStyle]}>{renderIcon}</View>
					</View>
				</TouchableOpacity>
			</View>
		)
	}

	renderActions() {
		const { autoInactive, children, spacing, verticalOrientation } = this.props
		const { active } = this.state

		if (!active) return null

		let actionButtons = !Array.isArray(children) ? [children] : children

		actionButtons = actionButtons.filter(actionButton => typeof actionButton === 'object')

		const actionStyle = {
			flex: 1,
			alignSelf: 'stretch',
			justifyContent: verticalOrientation === 'up' ? 'flex-end' : 'flex-start',
			paddingTop: verticalOrientation === 'down' ? spacing : 0,
		}

		return (
			<View style={actionStyle} pointerEvents={'box-none'}>
				{actionButtons.map((ActionButton, idx) => (
					<ActionButtonItem
						key={idx}
						{...this.props}
						{...ActionButton.props}
						onPress={() => {
							if (autoInactive) {
								this.timeout = this.reset()
							}
							ActionButton.props.onPress()
						}}
					/>
				))}
			</View>
		)
	}

	renderTappableBackground() {
		return (
			<TouchableOpacity
				activeOpacity={1}
				style={this.getOverlayStyles()}
				onPress={() => this.reset()}
			/>
		)
	}

	render() {
		const {
			backdrop,
			backgroundTappable,
			bgColor,
			bgOpacity,
			children,
			offsetY,
			style,
			verticalOrientation,
		} = this.props

		const { active } = this.state
		const backDropStyle = {
			backgroundColor: bgColor,
			opacity: bgOpacity,
		}
		const containerStyle = { alignItems: 'flex-end', paddingVertical: offsetY }

		return (
			<View pointerEvents={'box-none'} style={[this.getOverlayStyles(), style]}>
				<View pointerEvents={'none'} style={[this.getOverlayStyles(), backDropStyle]}>
					{backdrop}
				</View>
				<View pointerEvents={'box-none'} style={[this.getOverlayStyles(), containerStyle]}>
					{active && !backgroundTappable && this.renderTappableBackground()}

					{verticalOrientation === 'up' && children && this.renderActions()}
					{this.renderMainButton()}
					{verticalOrientation === 'down' && children && this.renderActions()}
				</View>
			</View>
		)
	}
}

ActionButton.Item = ActionButtonItem

ActionButton.propTypes = {
	active: PropTypes.bool,
	autoInactive: PropTypes.bool,
	backdrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
	backgroundTappable: PropTypes.bool,
	bgColor: PropTypes.string,
	bgOpacity: PropTypes.number,
	buttonColor: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
	height: PropTypes.number,
	offsetX: PropTypes.number,
	offsetY: PropTypes.number,
	onPress: PropTypes.func,
	renderIcon: PropTypes.element,
	resetToken: PropTypes.oneOfType([PropTypes.any]),
	size: PropTypes.number,
	spacing: PropTypes.number,
	style: PropTypes.oneOfType([PropTypes.object]),
	verticalOrientation: PropTypes.oneOf(['up', 'down']),
	width: PropTypes.number,
}

ActionButton.defaultProps = {
	active: false,
	autoInactive: true,
	backdrop: false,
	backgroundTappable: false,
	bgColor: 'transparent',
	bgOpacity: 1,
	buttonColor: '#000',
	children: null,
	height: PixelRatio.roundToNearestPixel(37),
	offsetX: PixelRatio.roundToNearestPixel(30),
	offsetY: PixelRatio.roundToNearestPixel(30),
	onPress: () => {},
	renderIcon: <Text style={[styles.btnText]}>+</Text>,
	resetToken: null,
	size: PixelRatio.roundToNearestPixel(56),
	spacing: PixelRatio.roundToNearestPixel(20),
	style: {},
	verticalOrientation: 'up',
	width: PixelRatio.roundToNearestPixel(56),
}
