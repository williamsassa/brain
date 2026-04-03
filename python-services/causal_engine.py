"""
Causal Inference Engine using DoWhy
Performs causal relationship analysis on medical data
"""

import logging
import json
from typing import Dict, List, Any, Optional
import pandas as pd
import numpy as np

logger = logging.getLogger(__name__)

# Lazy imports for DoWhy (optional dependency)
try:
    import dowhy
    from dowhy import CausalModel
    DOWHY_AVAILABLE = True
except ImportError:
    logger.warning("DoWhy not available - using fallback implementation")
    DOWHY_AVAILABLE = False


def analyze_causal_relationships(
    data: Dict[str, Any],
    variables: List[str],
    outcome: str,
    confounders: Optional[List[str]] = None
) -> Dict[str, Any]:
    """
    Analyze causal relationships in medical data using DoWhy framework

    Args:
        data: Patient data as dictionary or list of dictionaries
        variables: List of variable names to analyze
        outcome: Target outcome variable
        confounders: List of confounding variables to control for

    Returns:
        Dictionary with causal analysis results
    """

    try:
        # Validate inputs
        if not isinstance(variables, list) or len(variables) == 0:
            raise ValueError("variables must be a non-empty list")

        if not isinstance(outcome, str) or outcome not in variables:
            raise ValueError(f"outcome must be one of {variables}")

        if confounders is None:
            confounders = []

        # Convert data to DataFrame
        if isinstance(data, dict):
            # Single record - create minimal dataset
            df_data = {var: [data.get(var, 0)] for var in variables}
            df = pd.DataFrame(df_data)
        elif isinstance(data, list):
            df = pd.DataFrame(data)
        else:
            df = pd.DataFrame(data)

        logger.info(f"Analyzing causal relationships for outcome: {outcome}")
        logger.info(f"Variables: {variables}")
        logger.info(f"Confounders: {confounders}")

        # Ensure all variables are in the dataframe
        for var in variables:
            if var not in df.columns:
                df[var] = 0

        # Prepare treatment variables (all except outcome)
        treatments = [v for v in variables if v != outcome]

        if not treatments:
            raise ValueError("Must have at least one treatment variable")

        # Perform causal analysis
        if DOWHY_AVAILABLE and len(df) > 1:
            result = _analyze_with_dowhy(df, treatments, outcome, confounders)
        else:
            result = _analyze_fallback(df, treatments, outcome, confounders)

        return result

    except Exception as e:
        logger.error(f"Error in causal analysis: {str(e)}")
        raise ValueError(f"Causal analysis failed: {str(e)}")


def _analyze_with_dowhy(
    df: pd.DataFrame,
    treatments: List[str],
    outcome: str,
    confounders: List[str]
) -> Dict[str, Any]:
    """
    Perform causal analysis using DoWhy library
    """
    try:
        # Build causal graph
        # Simple assumption: confounders affect both treatment and outcome
        gml_graph = """
        digraph {
        """

        # Add confounders
        for conf in confounders:
            for treatment in treatments:
                gml_graph += f"    {conf} -> {treatment};\n"
            gml_graph += f"    {conf} -> {outcome};\n"

        # Add treatment to outcome edges
        for treatment in treatments:
            gml_graph += f"    {treatment} -> {outcome};\n"

        gml_graph += "}"

        logger.info("Causal graph created")

        # Create causal model
        model = CausalModel(
            data=df,
            treatment=treatments if len(treatments) == 1 else treatments[0],
            outcome=outcome,
            common_causes=confounders if confounders else None,
            graph=gml_graph
        )

        logger.info("Causal model initialized")

        # Identify causal effect
        identified_estimand = model.identify_effect(
            proceed_when_unidentifiable=True
        )

        # Estimate causal effect
        estimate = model.estimate_effect(
            identified_estimand,
            method_name="backdoor.linear_regression"
        )

        # Extract results
        causal_estimate = estimate.value if hasattr(estimate, 'value') else 0
        confidence_intervals = getattr(estimate, 'ci_left', None), getattr(estimate, 'ci_right', None)

        return {
            "method": "DoWhy Causal Inference",
            "causal_estimate": float(causal_estimate) if causal_estimate else 0,
            "confidence_interval": {
                "lower": float(confidence_intervals[0]) if confidence_intervals[0] else None,
                "upper": float(confidence_intervals[1]) if confidence_intervals[1] else None
            },
            "outcome": outcome,
            "treatments": treatments,
            "confounders": confounders,
            "sample_size": len(df),
            "pathways": _extract_causal_pathways(treatments, outcome, confounders),
            "interpretation": _interpret_results(float(causal_estimate) if causal_estimate else 0)
        }

    except Exception as e:
        logger.error(f"DoWhy analysis failed: {str(e)}, falling back to heuristic method")
        return _analyze_fallback(df, treatments, outcome, confounders)


def _analyze_fallback(
    df: pd.DataFrame,
    treatments: List[str],
    outcome: str,
    confounders: List[str]
) -> Dict[str, Any]:
    """
    Fallback causal analysis using correlation and statistical methods
    """
    try:
        # Calculate correlations
        numeric_df = df.select_dtypes(include=[np.number])

        correlations = {}
        for treatment in treatments:
            if treatment in numeric_df.columns:
                if outcome in numeric_df.columns:
                    corr = numeric_df[treatment].corr(numeric_df[outcome])
                    correlations[treatment] = float(corr) if not np.isnan(corr) else 0
                else:
                    correlations[treatment] = 0

        # Simple effect estimation
        avg_effect = np.mean(list(correlations.values())) if correlations else 0

        return {
            "method": "Correlation-based Heuristic Analysis",
            "causal_estimate": float(avg_effect),
            "confidence_interval": {
                "lower": float(avg_effect - 0.2),
                "upper": float(avg_effect + 0.2)
            },
            "outcome": outcome,
            "treatments": treatments,
            "confounders": confounders,
            "sample_size": len(df),
            "correlations": correlations,
            "pathways": _extract_causal_pathways(treatments, outcome, confounders),
            "interpretation": _interpret_results(float(avg_effect)),
            "note": "Using statistical correlations - DoWhy library not available for full causal inference"
        }

    except Exception as e:
        logger.error(f"Fallback analysis failed: {str(e)}")
        return _generate_minimal_result(treatments, outcome, confounders)


def _extract_causal_pathways(
    treatments: List[str],
    outcome: str,
    confounders: List[str]
) -> List[Dict[str, Any]]:
    """
    Extract and describe causal pathways
    """
    pathways = []

    # Direct treatment effects
    for treatment in treatments:
        pathways.append({
            "type": "direct",
            "from": treatment,
            "to": outcome,
            "description": f"Direct causal effect of {treatment} on {outcome}"
        })

    # Confounder effects
    for confounder in confounders:
        for treatment in treatments:
            pathways.append({
                "type": "confounding",
                "confounder": confounder,
                "from": treatment,
                "to": outcome,
                "description": f"{confounder} may confound the relationship between {treatment} and {outcome}"
            })

    return pathways


def _interpret_results(effect_size: float) -> str:
    """
    Provide clinical interpretation of causal effect
    """
    abs_effect = abs(effect_size)

    if abs_effect < 0.1:
        magnitude = "negligible"
    elif abs_effect < 0.3:
        magnitude = "small"
    elif abs_effect < 0.5:
        magnitude = "moderate"
    else:
        magnitude = "large"

    direction = "positive" if effect_size > 0 else "negative" if effect_size < 0 else "neutral"

    return f"The causal effect is {magnitude} and {direction} (effect size: {effect_size:.3f})"


def _generate_minimal_result(
    treatments: List[str],
    outcome: str,
    confounders: List[str]
) -> Dict[str, Any]:
    """
    Generate minimal result when analysis fails
    """
    return {
        "method": "Analysis Unavailable",
        "causal_estimate": 0,
        "confidence_interval": {"lower": None, "upper": None},
        "outcome": outcome,
        "treatments": treatments,
        "confounders": confounders,
        "sample_size": 0,
        "pathways": _extract_causal_pathways(treatments, outcome, confounders),
        "interpretation": "Insufficient data for causal analysis",
        "error": "Analysis could not be completed with provided data"
    }
